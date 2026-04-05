import { loadRepoConfigs } from "../config/repos.js";
import { fetchIssues } from "../pipeline/fetcher.js";
import { mapWithConcurrency } from "../utils/concurrency.js";
import { logger } from "../utils/logger.js";

interface FetchCommandOptions {
  config: string;
  dataDir: string;
  since?: string;
  maxPages?: number;
  force?: boolean;
  parallel: number;
}

export async function fetchCommand(
  repo: string | undefined,
  options: FetchCommandOptions
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
    try {
      const result = await fetchIssues({
        repo: r,
        dataDir: options.dataDir,
        since: options.since,
        maxPages: options.maxPages,
        force: options.force,
      });
      logger.info(`✓ [${index + 1}/${validRepos.length}] ${r}: ${result.totalFetched} issues (${result.newIssues} new, ${result.updatedIssues} updated)`);
    } catch (error) {
      logger.error(`Failed to fetch ${r}`, {
        error: error instanceof Error ? error.message : String(error),
      });
    }
  });
}
