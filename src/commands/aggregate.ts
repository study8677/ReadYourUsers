import { loadRepoConfigs } from "../config/repos.js";
import { aggregateIssues } from "../pipeline/aggregator.js";
import { logger } from "../utils/logger.js";

interface AggregateCommandOptions {
  config: string;
  dataDir: string;
  similarity: number;
  minClusterSize: number;
  model?: string;
}

export async function aggregateCommand(
  repo: string | undefined,
  options: AggregateCommandOptions
): Promise<void> {
  const configs = loadRepoConfigs(options.config);
  const repos = repo ? [repo] : configs.map((c) => c.repo);

  for (const r of repos) {
    const config = configs.find((c) => c.repo === r);
    if (!config) {
      logger.warn(`Repository ${r} not found in config, skipping`);
      continue;
    }

    try {
      const result = await aggregateIssues({
        repo: r,
        repoConfig: config,
        dataDir: options.dataDir,
        similarityThreshold: options.similarity,
        minClusterSize: options.minClusterSize,
        model: options.model,
      });
      logger.info(
        `✓ ${r}: ${result.clusters.length} clusters from ${result.total_issues_included} issues`
      );
    } catch (error) {
      logger.error(`Failed to aggregate ${r}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exitCode = 1;
    }
  }
}
