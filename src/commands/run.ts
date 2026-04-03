import { loadRepoConfigs } from "../config/repos.js";
import { fetchIssues } from "../pipeline/fetcher.js";
import { analyzeIssues } from "../pipeline/analyzer.js";
import { aggregateIssues } from "../pipeline/aggregator.js";
import { generateReports } from "../pipeline/generator.js";
import { logger } from "../utils/logger.js";

interface RunCommandOptions {
  config: string;
  dataDir: string;
  outputDir: string;
  concurrency: number;
}

export async function runCommand(
  repo: string | undefined,
  options: RunCommandOptions
): Promise<void> {
  const configs = loadRepoConfigs(options.config);
  const repos = repo ? [repo] : configs.map((c) => c.repo);

  for (const r of repos) {
    const config = configs.find((c) => c.repo === r);
    if (!config) {
      logger.warn(`Repository ${r} not found in config, skipping`);
      continue;
    }

    logger.info(`\n${"=".repeat(60)}`);
    logger.info(`Running full pipeline for ${config.display_name} (${r})`);
    logger.info(`${"=".repeat(60)}\n`);

    try {
      // Step 1: Fetch
      logger.info("Step 1/4: Fetching issues...");
      const fetchResult = await fetchIssues({
        repo: r,
        dataDir: options.dataDir,
      });
      logger.info(
        `Fetched ${fetchResult.totalFetched} issues (${fetchResult.newIssues} new)`
      );

      // Step 2: Analyze (last 30 days by default for performance)
      const sinceDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      logger.info(`\nStep 2/4: Analyzing issues (since ${sinceDate.slice(0, 10)})...`);
      const analyzeResult = await analyzeIssues({
        repo: r,
        dataDir: options.dataDir,
        concurrency: options.concurrency,
        since: sinceDate,
      });
      logger.info(
        `Analyzed ${analyzeResult.totalAnalyzed} issues (${analyzeResult.newAnalyses} new, ${analyzeResult.errors} errors)`
      );

      // Step 3: Aggregate
      logger.info("\nStep 3/4: Aggregating clusters...");
      const aggregation = await aggregateIssues({
        repo: r,
        repoConfig: config,
        dataDir: options.dataDir,
      });
      logger.info(
        `Generated ${aggregation.clusters.length} clusters from ${aggregation.total_issues_included} issues`
      );

      // Step 4: Generate
      logger.info("\nStep 4/4: Generating reports...");
      const genResult = await generateReports({
        repo: r,
        repoConfig: config,
        repoConfigs: configs,
        dataDir: options.dataDir,
        outputDir: options.outputDir,
      });
      logger.info(`Report: ${genResult.reportPath}`);

      logger.info(`\n✓ Pipeline complete for ${r}\n`);
    } catch (error) {
      logger.error(`Pipeline failed for ${r}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exitCode = 1;
    }
  }
}
