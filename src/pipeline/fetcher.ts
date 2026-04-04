import { Octokit } from "@octokit/rest";
import { throttling } from "@octokit/plugin-throttling";
import { resolve } from "node:path";
import type { RawIssue, RepoCacheMeta } from "../models/issue.js";
import { readJSON, writeJSON } from "../utils/cache.js";
import { repoSlug } from "../config/repos.js";
import { GITHUB_PER_PAGE } from "../config/constants.js";
import { logger } from "../utils/logger.js";

const ThrottledOctokit = Octokit.plugin(throttling);

function isNotModified(error: unknown): boolean {
  if (typeof error === "object" && error !== null && "status" in error) {
    return (error as { status: number }).status === 304;
  }
  return false;
}

function createOctokit(): InstanceType<typeof ThrottledOctokit> {
  const token =
    process.env.READYOURUSERS_GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error(
      "READYOURUSERS_GITHUB_TOKEN (or GITHUB_TOKEN) not set. Copy .env.example to .env and add your token."
    );
  }

  return new ThrottledOctokit({
    auth: token,
    throttle: {
      onRateLimit: (retryAfter: number, options: Record<string, unknown>, _octokit: unknown, retryCount: number) => {
        logger.warn(`Rate limited, retrying after ${retryAfter}s`, {
          method: options.method as string,
          url: options.url as string,
          retryCount,
        });
        return retryCount < 3;
      },
      onSecondaryRateLimit: (retryAfter: number, options: Record<string, unknown>) => {
        logger.warn(`Secondary rate limit hit, retrying after ${retryAfter}s`, {
          method: options.method as string,
          url: options.url as string,
        });
        return true;
      },
    },
  });
}

export interface FetchOptions {
  repo: string;
  dataDir: string;
  since?: string;
  maxPages?: number;
  force?: boolean;
}

export interface FetchResult {
  repo: string;
  totalFetched: number;
  newIssues: number;
  updatedIssues: number;
  cachedPath: string;
}

export async function fetchIssues(options: FetchOptions): Promise<FetchResult> {
  const { repo, dataDir, since, maxPages, force } = options;
  const [owner, repoName] = repo.split("/");

  const slug = repoSlug(repo);
  const dir = resolve(dataDir, "raw", slug);
  const issuesPath = resolve(dir, "issues.json");
  const metaPath = resolve(dir, "meta.json");

  const octokit = createOctokit();

  // Load existing cache
  let existingIssues: RawIssue[] = [];
  let meta: RepoCacheMeta | null = null;
  if (!force) {
    existingIssues = readJSON<RawIssue[]>(issuesPath) ?? [];
    meta = readJSON<RepoCacheMeta>(metaPath);
  }

  const existingMap = new Map(existingIssues.map((i) => [i.number, i]));
  const sinceDate = since ?? meta?.last_fetched ?? undefined;

  logger.info(`Fetching issues from ${repo}`, {
    cached: existingMap.size,
    since: sinceDate ?? "beginning",
  });

  // ETag freshness check: if we have a cached ETag, test if content changed
  let currentEtag: string | null = meta?.etag ?? null;
  if (!force && currentEtag && existingIssues.length > 0) {
    try {
      const probe = await octokit.issues.listForRepo({
        owner,
        repo: repoName,
        state: "all",
        sort: "created",
        direction: "desc",
        per_page: 1,
        page: 1,
        headers: { "If-None-Match": currentEtag },
      });
      // Update ETag from response
      currentEtag = (probe.headers.etag as string) ?? null;
    } catch (error: unknown) {
      if (isNotModified(error)) {
        logger.info(`ETag match — no changes for ${repo}, using cache`);
        return {
          repo,
          totalFetched: existingIssues.length,
          newIssues: 0,
          updatedIssues: 0,
          cachedPath: issuesPath,
        };
      }
      // Other errors: fall through to normal fetch
      logger.debug("ETag probe failed, proceeding with full fetch", {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  let page = 1;
  let newCount = 0;
  let updatedCount = 0;
  let keepGoing = true;

  while (keepGoing) {
    if (maxPages && page > maxPages) break;

    logger.debug(`Fetching page ${page}`, { repo, page });

    const response = await octokit.issues.listForRepo({
      owner,
      repo: repoName,
      state: "all",
      sort: "created",
      direction: "desc",
      per_page: GITHUB_PER_PAGE,
      page,
    });

    if (page === 1 && response.headers.etag) {
      currentEtag = response.headers.etag;
    }

    const items = response.data;
    if (items.length === 0) break;

    for (const item of items) {
      // Skip pull requests
      if (item.pull_request) continue;

      // Check if we've gone past our since window
      if (sinceDate && new Date(item.created_at) < new Date(sinceDate)) {
        // Check if this issue was updated after since date
        if (new Date(item.updated_at) < new Date(sinceDate)) {
          keepGoing = false;
          break;
        }
      }

      const issue: RawIssue = {
        id: item.id,
        number: item.number,
        title: item.title,
        body: item.body ?? null,
        state: item.state as "open" | "closed",
        labels: (item.labels ?? [])
          .filter((l): l is { name: string } => typeof l === "object" && l !== null && "name" in l)
          .map((l) => ({ name: l.name ?? "" })),
        reactions: item.reactions
          ? {
              total_count: item.reactions.total_count ?? 0,
              "+1": item.reactions["+1"] ?? 0,
              "-1": item.reactions["-1"] ?? 0,
              laugh: item.reactions.laugh ?? 0,
              hooray: item.reactions.hooray ?? 0,
              confused: item.reactions.confused ?? 0,
              heart: item.reactions.heart ?? 0,
              rocket: item.reactions.rocket ?? 0,
              eyes: item.reactions.eyes ?? 0,
            }
          : {
              total_count: 0,
              "+1": 0,
              "-1": 0,
              laugh: 0,
              hooray: 0,
              confused: 0,
              heart: 0,
              rocket: 0,
              eyes: 0,
            },
        comments: item.comments,
        created_at: item.created_at,
        updated_at: item.updated_at,
        closed_at: item.closed_at ?? null,
        user: {
          login: item.user?.login ?? "unknown",
          id: item.user?.id ?? 0,
        },
        html_url: item.html_url,
      };

      const existing = existingMap.get(issue.number);
      if (!existing) {
        newCount++;
      } else if (existing.updated_at !== issue.updated_at) {
        updatedCount++;
      }
      existingMap.set(issue.number, issue);
    }

    if (items.length < GITHUB_PER_PAGE) break;
    page++;
  }

  // Write results
  const allIssues = Array.from(existingMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  writeJSON(issuesPath, allIssues);

  const newMeta: RepoCacheMeta = {
    repo,
    etag: currentEtag,
    last_fetched: new Date().toISOString(),
    total_issues: allIssues.length,
    oldest_created_at: allIssues.length > 0 ? allIssues[allIssues.length - 1].created_at : null,
    newest_created_at: allIssues.length > 0 ? allIssues[0].created_at : null,
  };
  writeJSON(metaPath, newMeta);

  logger.info(`Fetch complete for ${repo}`, {
    total: allIssues.length,
    new: newCount,
    updated: updatedCount,
  });

  return {
    repo,
    totalFetched: allIssues.length,
    newIssues: newCount,
    updatedIssues: updatedCount,
    cachedPath: issuesPath,
  };
}
