import { loadRepoConfigs } from "../config/repos.js";
import { aggregateIssues } from "../pipeline/aggregator.js";
import { mapWithConcurrency } from "../utils/concurrency.js";
import { logger } from "../utils/logger.js";

interface AggregateCommandOptions {
  config: string;
  dataDir: string;
  similarity: number;
  minClusterSize: number;
  model?: string;
  llmMerge?: boolean;
  parallel: number;
}

export async function aggregateCommand(
  repo: string | undefined,
  options: AggregateCommandOptions
): Promise<void> {
  const configs = loadRepoConfigs(options.config);
  const repos = repo ? [repo] : configs.map((c) => c.repo);
  const validRepos = repos.filter((r) => {
    if (!configs.find((c) => c.repo === r)) {
      logger.warn(`Repository ${r} not found in config, skipping`);
      return false;
    }
    return true;
  });

  await mapWithConcurrency(validRepos, options.parallel, async (r, index) => {
    const config = configs.find((c) => c.repo === r)!;
    try {
      const result = await aggregateIssues({
        repo: r,
        repoConfig: config,
        dataDir: options.dataDir,
        similarityThreshold: options.similarity,
        minClusterSize: options.minClusterSize,
        model: options.model,
        useLlmMerge: options.llmMerge,
      });
      logger.info(
        `✓ [${index + 1}/${validRepos.length}] ${r}: ${result.clusters.length} clusters from ${result.total_issues_included} issues`
      );
    } catch (error) {
      logger.error(`Failed to aggregate ${r}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
