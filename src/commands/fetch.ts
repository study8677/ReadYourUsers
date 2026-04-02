import { loadRepoConfigs } from "../config/repos.js";
import { fetchIssues } from "../pipeline/fetcher.js";
import { logger } from "../utils/logger.js";

interface FetchCommandOptions {
  config: string;
  dataDir: string;
  since?: string;
  maxPages?: number;
  force?: boolean;
}

export async function fetchCommand(
  repo: string | undefined,
  options: FetchCommandOptions
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
      const result = await fetchIssues({
        repo: r,
        dataDir: options.dataDir,
        since: options.since,
        maxPages: options.maxPages,
        force: options.force,
      });
      logger.info(`✓ ${r}: ${result.totalFetched} issues (${result.newIssues} new, ${result.updatedIssues} updated)`);
    } catch (error) {
      logger.error(`Failed to fetch ${r}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exitCode = 1;
    }
  }
}
