import { loadRepoConfigs } from "../config/repos.js";
import { generateReports, MissingAggregatedDataError } from "../pipeline/generator.js";
import { logger } from "../utils/logger.js";

interface GenerateCommandOptions {
  config: string;
  dataDir: string;
  outputDir: string;
  llmThemes?: boolean;
}

export async function generateCommand(
  repo: string | undefined,
  options: GenerateCommandOptions
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
      const result = await generateReports({
        repo: r,
        repoConfig: config,
        repoConfigs: configs,
        dataDir: options.dataDir,
        outputDir: options.outputDir,
        useLlmThemes: options.llmThemes,
      });
      logger.info(`✓ ${r}: Report at ${result.reportPath}`, {
        readmeUpdated: result.readmeUpdated,
      });
    } catch (error) {
      if (!repo && error instanceof MissingAggregatedDataError) {
        logger.warn(`Skipping ${r}: aggregated data is missing`, {
          error: error.message,
        });
        continue;
      }

      logger.error(`Failed to generate reports for ${r}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      process.exitCode = 1;
    }
  }
}
