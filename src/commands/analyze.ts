import { loadRepoConfigs } from "../config/repos.js";
import { analyzeIssues } from "../pipeline/analyzer.js";
import { TREND_WINDOW_DAYS } from "../config/constants.js";
import { logger } from "../utils/logger.js";

interface AnalyzeCommandOptions {
  config: string;
  dataDir: string;
  model?: string;
  concurrency: number;
  reAnalyze?: boolean;
  since?: string;
}

export async function analyzeCommand(
  repo: string | undefined,
  options: AnalyzeCommandOptions
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
      const result = await analyzeIssues({
        repo: r,
        dataDir: options.dataDir,
        model: options.model,
        concurrency: options.concurrency,
        reAnalyze: options.reAnalyze,
        since: options.since ?? new Date(Date.now() - TREND_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      });
      logger.info(
        `✓ ${r}: ${result.totalAnalyzed} analyzed (${result.newAnalyses} new, ${result.skipped} skipped, ${result.errors} errors)`
      );
    } catch (error) {
      logger.error(`Failed to analyze ${r}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exitCode = 1;
    }
  }
}
