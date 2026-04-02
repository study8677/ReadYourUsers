import { resolve } from "node:path";
import type { RawIssue } from "../models/issue.js";
import type { IssueAnalysis, AnalysisCache } from "../models/analysis.js";
import { IssueAnalysisSchema } from "../schemas/analysis.js";
import { callStructured } from "../llm/client.js";
import {
  ISSUE_ANALYSIS_SYSTEM_PROMPT,
  buildIssueAnalysisUserPrompt,
} from "../llm/prompts.js";
import { readJSON, writeJSON } from "../utils/cache.js";
import { repoSlug } from "../config/repos.js";
import { ANALYSIS_MODEL } from "../config/constants.js";
import { mapWithConcurrency } from "../utils/concurrency.js";
import { logger } from "../utils/logger.js";

export interface AnalyzeOptions {
  repo: string;
  dataDir: string;
  model?: string;
  concurrency?: number;
  reAnalyze?: boolean;
}

export interface AnalyzeResult {
  repo: string;
  totalAnalyzed: number;
  newAnalyses: number;
  skipped: number;
  errors: number;
}

export async function analyzeIssues(options: AnalyzeOptions): Promise<AnalyzeResult> {
  const {
    repo,
    dataDir,
    model = ANALYSIS_MODEL,
    concurrency = 5,
    reAnalyze = false,
  } = options;

  const slug = repoSlug(repo);
  const issuesPath = resolve(dataDir, "raw", slug, "issues.json");
  const cachePath = resolve(dataDir, "analyzed", slug, "analyses.json");

  // Load issues
  const issues = readJSON<RawIssue[]>(issuesPath);
  if (!issues || issues.length === 0) {
    throw new Error(
      `No issues found at ${issuesPath}. Run 'ryu fetch ${repo}' first.`
    );
  }

  // Load existing analyses
  let cache = readJSON<AnalysisCache>(cachePath);
  if (!cache || reAnalyze) {
    cache = {
      repo,
      last_analyzed: new Date().toISOString(),
      analyses: [],
      issue_versions: {},
    };
  }

  const existingMap = new Map(cache.analyses.map((a) => [a.issue_number, a]));

  // Determine which issues need analysis
  const toAnalyze = issues.filter((issue) => {
    if (reAnalyze) return true;
    const cachedVersion = cache!.issue_versions[issue.number];
    return !cachedVersion || cachedVersion !== issue.updated_at;
  });

  logger.info(`Analyzing issues for ${repo}`, {
    total: issues.length,
    toAnalyze: toAnalyze.length,
    cached: existingMap.size,
  });

  if (toAnalyze.length === 0) {
    logger.info("All issues already analyzed, skipping");
    return {
      repo,
      totalAnalyzed: cache.analyses.length,
      newAnalyses: 0,
      skipped: issues.length,
      errors: 0,
    };
  }

  let errorCount = 0;
  let newCount = 0;

  const results = await mapWithConcurrency(
    toAnalyze,
    concurrency,
    async (issue, index) => {
      try {
        logger.debug(
          `Analyzing issue #${issue.number} (${index + 1}/${toAnalyze.length})`,
          { title: issue.title.slice(0, 60) }
        );

        const result = await callStructured({
          model,
          systemPrompt: ISSUE_ANALYSIS_SYSTEM_PROMPT,
          userPrompt: buildIssueAnalysisUserPrompt({
            title: issue.title,
            body: issue.body,
            labels: issue.labels.map((l) => l.name),
            comments: issue.comments,
            state: issue.state,
            created_at: issue.created_at,
            repo,
          }),
          schema: IssueAnalysisSchema,
          schemaName: "issue_analysis",
          useCache: true,
        });

        const analysis: IssueAnalysis = {
          issue_number: issue.number,
          issue_url: issue.html_url,
          repo,
          ...result,
          reactions_total: issue.reactions.total_count,
          comments_count: issue.comments,
          created_at: issue.created_at,
          state: issue.state,
        };

        newCount++;
        return analysis;
      } catch (error) {
        errorCount++;
        logger.error(`Failed to analyze issue #${issue.number}`, {
          error: error instanceof Error ? error.message : String(error),
        });
        // Return existing analysis if available, otherwise null
        return existingMap.get(issue.number) ?? null;
      }
    }
  );

  // Merge results with existing
  for (const result of results) {
    if (result) {
      existingMap.set(result.issue_number, result);
    }
  }

  // Update version tracking
  const issueVersions: Record<number, string> = {};
  for (const issue of issues) {
    if (existingMap.has(issue.number)) {
      issueVersions[issue.number] = issue.updated_at;
    }
  }

  const updatedCache: AnalysisCache = {
    repo,
    last_analyzed: new Date().toISOString(),
    analyses: Array.from(existingMap.values()),
    issue_versions: issueVersions,
  };

  writeJSON(cachePath, updatedCache);

  logger.info(`Analysis complete for ${repo}`, {
    total: updatedCache.analyses.length,
    new: newCount,
    errors: errorCount,
  });

  return {
    repo,
    totalAnalyzed: updatedCache.analyses.length,
    newAnalyses: newCount,
    skipped: issues.length - toAnalyze.length,
    errors: errorCount,
  };
}
