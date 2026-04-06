import { resolve } from "node:path";
import { createHash } from "node:crypto";
import type { IssueAnalysis, AnalysisCache } from "../models/analysis.js";
import type { NeedCluster, RepoAggregation } from "../models/cluster.js";
import { ClusterSummarySchema, ClusterMergeSchema } from "../schemas/analysis.js";
import { callStructured } from "../llm/client.js";
import {
  CLUSTER_SUMMARY_SYSTEM_PROMPT,
  buildClusterSummaryPrompt,
  CLUSTER_MERGE_SYSTEM_PROMPT,
  buildClusterMergePrompt,
} from "../llm/prompts.js";
import { computeDemandScore } from "../scoring/demand.js";
import { computeRisingScore } from "../scoring/rising.js";
import { readJSON, writeJSON } from "../utils/cache.js";
import { repoSlug, type RepoConfig } from "../config/repos.js";
import {
  AGGREGATION_MODEL,
  DEFAULT_MIN_CLUSTER_SIZE,
  DEFAULT_SIMILARITY_THRESHOLD,
} from "../config/constants.js";
import { textSimilarity } from "../utils/similarity.js";
import { mapWithConcurrency } from "../utils/concurrency.js";
import { logger } from "../utils/logger.js";

export interface AggregateOptions {
  repo: string;
  repoConfig: RepoConfig;
  dataDir: string;
  similarityThreshold?: number;
  minClusterSize?: number;
  model?: string;
  useLlmMerge?: boolean;
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

/** LLM-based merge pass: check pairs of sub-clusters with borderline similarity */
async function llmMergeClusters(
  clusters: PreCluster[],
  model: string,
  lowThreshold: number,
  highThreshold: number
): Promise<PreCluster[]> {
  // Build list of candidate pairs to check
  interface MergePair { i: number; j: number; sim: number }
  const pairs: MergePair[] = [];

  for (let i = 0; i < clusters.length; i++) {
    for (let j = i + 1; j < clusters.length; j++) {
      // Only check pairs within the same tag
      if (clusters[i].tag !== clusters[j].tag) continue;

      const sim = textSimilarity(
        clusters[i].needs[0] ?? "",
        clusters[j].needs[0] ?? ""
      );
      if (sim >= lowThreshold && sim < highThreshold) {
        pairs.push({ i, j, sim });
      }
    }
  }

  if (pairs.length === 0) return clusters;

  logger.info(`LLM merge: checking ${pairs.length} borderline cluster pairs`);

  // Ask LLM for each pair
  const mergeDecisions = await mapWithConcurrency(
    pairs,
    3, // lower concurrency for merge checks
    async (pair) => {
      try {
        const result = await callStructured({
          model,
          systemPrompt: CLUSTER_MERGE_SYSTEM_PROMPT,
          userPrompt: buildClusterMergePrompt(
            clusters[pair.i].needs[0],
            clusters[pair.j].needs[0]
          ),
          schema: ClusterMergeSchema,
          schemaName: "cluster_merge",
          maxTokens: 256,
          useCache: false,
        });
        return { ...pair, shouldMerge: result.should_merge };
      } catch {
        return { ...pair, shouldMerge: false };
      }
    }
  );

  // Apply merges (greedy: once a cluster is merged, skip it)
  const merged = new Set<number>();
  const result: PreCluster[] = [];

  // Group merges by target
  const mergeMap = new Map<number, number[]>();
  for (const decision of mergeDecisions) {
    if (decision.shouldMerge && !merged.has(decision.i) && !merged.has(decision.j)) {
      merged.add(decision.j);
      const existing = mergeMap.get(decision.i) ?? [];
      existing.push(decision.j);
      mergeMap.set(decision.i, existing);
    }
  }

  for (let i = 0; i < clusters.length; i++) {
    if (merged.has(i)) continue;

    let current = clusters[i];
    const toMerge = mergeMap.get(i) ?? [];
    for (const j of toMerge) {
      current = {
        tag: current.tag,
        needs: [...current.needs, ...clusters[j].needs],
        analyses: [...current.analyses, ...clusters[j].analyses],
      };
    }
    result.push(current);
  }

  const mergedCount = clusters.length - result.length;
  if (mergedCount > 0) {
    logger.info(`LLM merge: combined ${mergedCount} cluster pairs`);
  }

  return result;
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

  // Step 1: Group by primary module_tag, then sub-cluster by need similarity
  const rawTagGroups = groupByModuleTag(analyses);
  const similarityThreshold =
    options.similarityThreshold ?? DEFAULT_SIMILARITY_THRESHOLD;
  const tagGroups = rawTagGroups.flatMap((group) =>
    subClusterByNeedSimilarity(group.tag, group.analyses, similarityThreshold)
  );
  logger.info(
    `Grouped into ${rawTagGroups.length} tag groups, then sub-clustered into ${tagGroups.length} clusters (similarity >= ${similarityThreshold})`
  );

  // Optional LLM-based merge for borderline-similar clusters
  let finalClusters = tagGroups;
  if (options.useLlmMerge) {
    finalClusters = await llmMergeClusters(
      tagGroups,
      model,
      0.15,
      similarityThreshold
    );
    logger.info(`After LLM merge: ${finalClusters.length} clusters (was ${tagGroups.length})`);
  }

  // Step 2: Filter by minimum size
  const significantClusters = finalClusters.filter(
    (c) => c.analyses.length >= minClusterSize
  );

  // Also collect singleton issues into an "Other" bucket,
  // but only if it won't dominate the results (≤ 30% of total).
  const singletons = finalClusters.filter((c) => c.analyses.length < minClusterSize);
  if (singletons.length > 0) {
    const otherCluster: PreCluster = {
      tag: "other",
      needs: singletons.flatMap((s) => s.needs),
      analyses: singletons.flatMap((s) => s.analyses),
    };
    const otherRatio = otherCluster.analyses.length / analyses.length;
    if (otherCluster.analyses.length >= minClusterSize && otherRatio <= 0.3) {
      significantClusters.push(otherCluster);
    } else if (otherRatio > 0.3) {
      logger.info(
        `Skipping "other" bucket: ${otherCluster.analyses.length} singletons (${Math.round(otherRatio * 100)}% of total) — too large to be meaningful`
      );
    }
  }

  logger.info(
    `${significantClusters.length} clusters above min-size (>=${minClusterSize})`
  );

  // Compute global max engagement for fair cross-cluster scoring
  const globalMaxEngagement = Math.max(
    ...analyses.map((a) => a.reactions_total + a.comments_count * 2),
    1
  );

  // Step 3: Generate LLM summaries for each cluster
  const now = new Date();
  const needClusters: NeedCluster[] = [];

  for (let i = 0; i < significantClusters.length; i++) {
    const pc = significantClusters[i];
    logger.info(
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
      globalMaxEngagement,
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
 * Sub-cluster analyses within a tag group by need similarity.
 * Uses single-linkage: an issue joins a cluster if it is similar
 * enough to any need already in that cluster.
 */
function subClusterByNeedSimilarity(
  tag: string,
  analyses: IssueAnalysis[],
  threshold: number
): PreCluster[] {
  const clusters: PreCluster[] = [];
  const assigned = new Set<number>();

  for (let i = 0; i < analyses.length; i++) {
    if (assigned.has(i)) continue;
    assigned.add(i);

    const cluster: IssueAnalysis[] = [analyses[i]];
    const clusterNeeds: string[] = [analyses[i].normalized_need];

    for (let j = i + 1; j < analyses.length; j++) {
      if (assigned.has(j)) continue;

      // Check similarity against any need already in the cluster
      const sim = Math.max(
        ...clusterNeeds.map((need) =>
          textSimilarity(need, analyses[j].normalized_need)
        )
      );

      if (sim >= threshold) {
        assigned.add(j);
        cluster.push(analyses[j]);
        clusterNeeds.push(analyses[j].normalized_need);
      }
    }

    clusters.push({
      tag,
      needs: clusterNeeds,
      analyses: cluster,
    });
  }

  return clusters;
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
