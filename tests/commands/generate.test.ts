import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { generateCommand } from "../../src/commands/generate.js";
import type { RepoConfig } from "../../src/config/repos.js";
import type { RepoAggregation } from "../../src/models/cluster.js";
import type { CrossProductSummary } from "../../src/models/site.js";
import { readJSON, writeJSON } from "../../src/utils/cache.js";

const availableConfig: RepoConfig = {
  repo: "openai/codex",
  display_name: "OpenAI Codex CLI",
  category: "AI Coding Assistant",
  include_in_homepage: true,
  weight: 1,
};

const missingConfig: RepoConfig = {
  repo: "getcursor/cursor",
  display_name: "Cursor",
  category: "AI Code Editor",
  include_in_homepage: true,
  weight: 0.8,
};

const aggregation: RepoAggregation = {
  repo: "openai/codex",
  display_name: "OpenAI Codex CLI",
  generated_at: "2026-04-03T00:00:00.000Z",
  window_start: "2026-03-27T00:00:00.000Z",
  window_end: "2026-04-03T00:00:00.000Z",
  total_issues_analyzed: 20,
  total_issues_included: 12,
  category_breakdown: { Workflow: 3, Reliability: 1 },
  clusters: [
    {
      cluster_id: "codex-workflow",
      title: "Agent workflow control",
      summary: "Codex users want tighter control over long-running agents.",
      category: "Workflow",
      representative_need: "Improve agent control",
      issue_numbers: [1, 2],
      issue_urls: ["https://github.com/openai/codex/issues/1"],
      sample_titles: ["Agent loop control"],
      demand_score: 12,
      rising_score: 4,
      volume: 8,
      open_count: 6,
      closed_count: 2,
      avg_reactions: 3,
      avg_comments: 2,
      date_first_seen: "2026-03-27T00:00:00.000Z",
      date_last_seen: "2026-04-03T00:00:00.000Z",
      repos_affected: ["openai/codex"],
    },
    {
      cluster_id: "codex-reliability",
      title: "Session stability",
      summary: "Long runs should survive transient failures.",
      category: "Reliability",
      representative_need: "Prevent dropped sessions",
      issue_numbers: [3, 4],
      issue_urls: ["https://github.com/openai/codex/issues/3"],
      sample_titles: ["Crash during long run"],
      demand_score: 9,
      rising_score: 2,
      volume: 4,
      open_count: 3,
      closed_count: 1,
      avg_reactions: 2,
      avg_comments: 1,
      date_first_seen: "2026-03-27T00:00:00.000Z",
      date_last_seen: "2026-04-03T00:00:00.000Z",
      repos_affected: ["openai/codex"],
    },
  ],
};

afterEach(() => {
  process.exitCode = undefined;
});

describe("generateCommand", () => {
  it("skips configured repos that do not have aggregated data when generating all reports", async () => {
    const root = mkdtempSync(resolve(tmpdir(), "ryu-generate-command-"));
    const configPath = resolve(root, "config", "repos.json");
    const dataDir = resolve(root, "data");
    const outputDir = resolve(root, "reports");
    const previousCwd = process.cwd();

    writeJSON(configPath, { repos: [availableConfig, missingConfig] });
    writeJSON(
      resolve(dataDir, "aggregated", "openai-codex", "clusters.json"),
      aggregation
    );

    process.chdir(root);

    try {
      await generateCommand(undefined, { config: configPath, dataDir, outputDir });
    } finally {
      process.chdir(previousCwd);
    }

    expect(process.exitCode).toBeUndefined();
    expect(existsSync(resolve(outputDir, "latest", "openai-codex.md"))).toBe(true);
    expect(existsSync(resolve(outputDir, "latest", "cross-product.json"))).toBe(true);

    const summary = readJSON<CrossProductSummary>(
      resolve(outputDir, "latest", "cross-product.json")
    );

    expect(summary?.products.map((product) => product.slug)).toEqual(["openai-codex"]);
  });

  it("keeps explicit single-repo generate as a failure when aggregated data is missing", async () => {
    const root = mkdtempSync(resolve(tmpdir(), "ryu-generate-command-single-"));
    const configPath = resolve(root, "config", "repos.json");
    const dataDir = resolve(root, "data");
    const outputDir = resolve(root, "reports");
    const previousCwd = process.cwd();

    writeJSON(configPath, { repos: [availableConfig, missingConfig] });

    process.chdir(root);

    try {
      await generateCommand("getcursor/cursor", { config: configPath, dataDir, outputDir });
    } finally {
      process.chdir(previousCwd);
    }

    expect(process.exitCode).toBe(1);
    expect(existsSync(resolve(outputDir, "latest", "getcursor-cursor.md"))).toBe(false);
  });
});

