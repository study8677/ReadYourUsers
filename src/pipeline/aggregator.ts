import { resolve } from "node:path";
import { createHash } from "node:crypto";
import type { IssueAnalysis, AnalysisCache } from "../models/analysis.js";
import type { NeedCluster, RepoAggregation } from "../models/cluster.js";
import { ClusterSummarySchema } from "../schemas/analysis.js";
import { callStructured } from "../llm/client.js";
import {
  CLUSTER_SUMMARY_SYSTEM_PROMPT,
  buildClusterSummaryPrompt,
} from "../llm/prompts.js";
import { computeDemandScore } from "../scoring/demand.js";
import { computeRisingScore } from "../scoring/rising.js";
import { readJSON, writeJSON } from "../utils/cache.js";
import { repoSlug, type RepoConfig } from "../config/repos.js";
import { AGGREGATION_MODEL, DEFAULT_MIN_CLUSTER_SIZE } from "../config/constants.js";
import { logger } from "../utils/logger.js";

export interface AggregateOptions {
  repo: string;
  repoConfig: RepoConfig;
  dataDir: string;
  similarityThreshold?: number;
  minClusterSize?: number;
  model?: string;
}

/** Create a deterministic cluster ID */
function makeClusterId(needs: string[]): string {
  const hash = createHash("sha256")
    .update(needs.sort().join("|"))
    .digest("hex");
  return hash.slice(0, 12);
}

interface PreCluster {
  tag: string;
  needs: string[];
  analyses: IssueAnalysis[];
}

export async function aggregateIssues(
  options: AggregateOptions
): Promise<RepoAggregation> {
  const {
    repo,
    repoConfig,
    dataDir,
    minClusterSize = DEFAULT_MIN_CLUSTER_SIZE,
    model = AGGREGATION_MODEL,
  } = options;

  const slug = repoSlug(repo);
  const cachePath = resolve(dataDir, "analyzed", slug, "analyses.json");
  const outputPath = resolve(dataDir, "aggregated", slug, "clusters.json");

  const cache = readJSON<AnalysisCache>(cachePath);
  if (!cache || cache.analyses.length === 0) {
    throw new Error(
      `No analyses found at ${cachePath}. Run 'ryu analyze ${repo}' first.`
    );
  }

  const analyses = cache.analyses.filter((a) => a.should_include);
  logger.info(`Aggregating ${analyses.length} issues for ${repo}`, {
    total: cache.analyses.length,
    included: analyses.length,
  });

  // Step 1: Group by primary module_tag
  const tagGroups = groupByModuleTag(analyses);
  logger.info(`Grouped into ${tagGroups.length} tag-based clusters`);

  // Step 2: Filter by minimum size
  const significantClusters = tagGroups.filter(
    (c) => c.analyses.length >= minClusterSize
  );

  // Also collect singleton issues into an "Other" bucket
  const singletons = tagGroups.filter((c) => c.analyses.length < minClusterSize);
  if (singletons.length > 0) {
    const otherCluster: PreCluster = {
      tag: "other",
      needs: singletons.flatMap((s) => s.needs),
      analyses: singletons.flatMap((s) => s.analyses),
    };
    if (otherCluster.analyses.length >= minClusterSize) {
      significantClusters.push(otherCluster);
    }
  }

  logger.info(
    `${significantClusters.length} clusters above min-size (>=${minClusterSize})`
  );

  // Step 3: Generate LLM summaries for each cluster
  const now = new Date();
  const needClusters: NeedCluster[] = [];

  for (let i = 0; i < significantClusters.length; i++) {
    const pc = significantClusters[i];
    logger.debug(
      `Summarizing cluster ${i + 1}/${significantClusters.length} (${pc.tag})`,
      { issues: pc.analyses.length }
    );

    let title: string;
    let summary: string;
    let category: string;

    try {
      const summaryResult = await callStructured({
        model,
        systemPrompt: CLUSTER_SUMMARY_SYSTEM_PROMPT,
        userPrompt: buildClusterSummaryPrompt(
          pc.needs.slice(0, 15),
          pc.analyses.slice(0, 5).map((a) => a.normalized_need)
        ),
        schema: ClusterSummarySchema,
        schemaName: "cluster_summary",
        useCache: false,
      });
      title = summaryResult.title;
      summary = summaryResult.summary;
      category = summaryResult.category;
    } catch (error) {
      logger.warn("Failed to generate cluster summary, using fallback", {
        error: error instanceof Error ? error.message : String(error),
      });
      title = `Issues related to ${pc.tag}`;
      summary = `${pc.analyses.length} issues: ${pc.needs.slice(0, 3).join("; ")}`;
      category = pc.tag.charAt(0).toUpperCase() + pc.tag.slice(1);
    }

    const demandScore = computeDemandScore({
      analyses: pc.analyses,
      reposAffected: 1,
      now,
    });

    const risingScore = computeRisingScore(pc.analyses, now);

    const openCount = pc.analyses.filter((a) => a.state === "open").length;
    const closedCount = pc.analyses.filter((a) => a.state === "closed").length;

    const dates = pc.analyses.map((a) => new Date(a.created_at).getTime());
    const avgReactions =
      pc.analyses.reduce((s, a) => s + a.reactions_total, 0) / pc.analyses.length;
    const avgComments =
      pc.analyses.reduce((s, a) => s + a.comments_count, 0) / pc.analyses.length;

    needClusters.push({
      cluster_id: makeClusterId(pc.needs),
      title,
      summary,
      category,
      representative_need: pc.needs[0],
      issue_numbers: pc.analyses.map((a) => a.issue_number),
      issue_urls: pc.analyses.map((a) => a.issue_url),
      sample_titles: pc.needs.slice(0, 3),
      demand_score: demandScore,
      rising_score: risingScore,
      volume: pc.analyses.length,
      open_count: openCount,
      closed_count: closedCount,
      avg_reactions: Math.round(avgReactions * 10) / 10,
      avg_comments: Math.round(avgComments * 10) / 10,
      date_first_seen: new Date(Math.min(...dates)).toISOString(),
      date_last_seen: new Date(Math.max(...dates)).toISOString(),
      repos_affected: [repo],
    });
  }

  // Sort by demand score
  needClusters.sort((a, b) => b.demand_score - a.demand_score);

  // Build category breakdown
  const categoryBreakdown: Record<string, number> = {};
  for (const c of needClusters) {
    categoryBreakdown[c.category] = (categoryBreakdown[c.category] ?? 0) + 1;
  }

  const aggregation: RepoAggregation = {
    repo,
    display_name: repoConfig.display_name,
    generated_at: now.toISOString(),
    window_start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    window_end: now.toISOString(),
    total_issues_analyzed: cache.analyses.length,
    total_issues_included: analyses.length,
    clusters: needClusters,
    category_breakdown: categoryBreakdown,
  };

  writeJSON(outputPath, aggregation);

  logger.info(`Aggregation complete for ${repo}`, {
    clusters: needClusters.length,
    categories: Object.keys(categoryBreakdown).length,
  });

  return aggregation;
}

/**
 * Group analyses by their primary module_tag.
 * Each issue's first tag is used as the primary grouping key.
 * Tags with shared roots (e.g., "platform:windows", "platform:android") are merged.
 */
function groupByModuleTag(analyses: IssueAnalysis[]): PreCluster[] {
  const groups = new Map<string, IssueAnalysis[]>();

  for (const analysis of analyses) {
    // Use first module_tag as primary, normalize sub-tags
    let primaryTag = analysis.module_tags[0] ?? "other";
    // Merge sub-tags: "platform:windows" -> "platform"
    if (primaryTag.includes(":")) {
      primaryTag = primaryTag.split(":")[0];
    }
    primaryTag = primaryTag.toLowerCase();

    const list = groups.get(primaryTag) ?? [];
    list.push(analysis);
    groups.set(primaryTag, list);
  }

  return Array.from(groups.entries())
    .map(([tag, tagAnalyses]) => ({
      tag,
      needs: tagAnalyses.map((a) => a.normalized_need),
      analyses: tagAnalyses,
    }))
    .sort((a, b) => b.analyses.length - a.analyses.length);
}
