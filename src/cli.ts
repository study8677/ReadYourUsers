#!/usr/bin/env node
import "dotenv/config";
import { Command } from "commander";
import { setLogLevel } from "./utils/logger.js";
import { fetchCommand } from "./commands/fetch.js";
import { analyzeCommand } from "./commands/analyze.js";
import { aggregateCommand } from "./commands/aggregate.js";
import { generateCommand } from "./commands/generate.js";
import { runCommand } from "./commands/run.js";

const program = new Command();

program
  .name("ryu")
  .description("ReadYourUsers — Turn public GitHub issues into user demand maps")
  .version("0.1.0")
  .option("--verbose", "Enable verbose logging")
  .hook("preAction", (thisCommand) => {
    if (thisCommand.opts().verbose) {
      setLogLevel("debug");
    }
  });

program
  .command("fetch")
  .description("Fetch issues from GitHub API")
  .argument("[repo]", "Repository in owner/repo format")
  .option("--config <path>", "Path to repos.json", "./config/repos.json")
  .option("--data-dir <path>", "Data directory", "./data")
  .option("--since <date>", "Only fetch issues created after this date (ISO 8601)")
  .option("--max-pages <n>", "Maximum pages to fetch", parseInt)
  .option("--force", "Ignore cache, re-fetch everything")
  .action(fetchCommand);

program
  .command("analyze")
  .description("Run LLM analysis on fetched issues")
  .argument("[repo]", "Repository in owner/repo format")
  .option("--config <path>", "Path to repos.json", "./config/repos.json")
  .option("--data-dir <path>", "Data directory", "./data")
  .option("--model <name>", "LLM model to use")
  .option("--concurrency <n>", "Parallel analysis requests", parseInt, 5)
  .option("--re-analyze", "Re-analyze all issues, not just new ones")
  .action(analyzeCommand);

program
  .command("aggregate")
  .description("Cluster and rank analyzed issues")
  .argument("[repo]", "Repository in owner/repo format")
  .option("--config <path>", "Path to repos.json", "./config/repos.json")
  .option("--data-dir <path>", "Data directory", "./data")
  .option("--similarity <n>", "Similarity threshold for clustering", parseFloat, 0.4)
  .option("--min-cluster-size <n>", "Minimum issues per cluster", parseInt, 2)
  .option("--model <name>", "Model for cluster summarization")
  .action(aggregateCommand);

program
  .command("generate")
  .description("Generate reports and update README")
  .argument("[repo]", "Repository in owner/repo format")
  .option("--config <path>", "Path to repos.json", "./config/repos.json")
  .option("--data-dir <path>", "Data directory", "./data")
  .option("--output-dir <path>", "Reports output directory", "./reports")
  .action(generateCommand);

program
  .command("run")
  .description("Run full pipeline: fetch → analyze → aggregate → generate")
  .argument("[repo]", "Repository in owner/repo format")
  .option("--config <path>", "Path to repos.json", "./config/repos.json")
  .option("--data-dir <path>", "Data directory", "./data")
  .option("--output-dir <path>", "Reports output directory", "./reports")
  .option("--concurrency <n>", "Parallel analysis requests", parseInt, 5)
  .action(runCommand);

program.parse();
