import { existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import type { RepoConfig } from "../../src/config/repos.js";
import type { RepoAggregation } from "../../src/models/cluster.js";
import { buildCrossProductSummary } from "../../src/pipeline/cross-product.js";
import {
  generateReports,
  writeCrossProductSummary,
} from "../../src/pipeline/generator.js";
import { readJSON, writeJSON } from "../../src/utils/cache.js";
import type { CrossProductSummary } from "../../src/models/site.js";

const baseAggregation: RepoAggregation = {
  repo: "anthropics/claude-code",
  display_name: "Claude Code",
  generated_at: "2026-04-03T00:00:00.000Z",
  window_start: "2026-03-27T00:00:00.000Z",
  window_end: "2026-04-03T00:00:00.000Z",
  total_issues_analyzed: 100,
  total_issues_included: 80,
  category_breakdown: { Reliability: 3, Integration: 2, Workflow: 1 },
  clusters: [
    {
      cluster_id: "claude-mcp",
      title: "MCP reliability",
      summary: "Claude users need MCP stability.",
      category: "Integration",
      representative_need: "Fix MCP setup and runtime failures",
      issue_numbers: [1, 2],
      issue_urls: ["https://github.com/anthropics/claude-code/issues/1"],
      sample_titles: ["MCP breaks"],
      demand_score: 10,
      rising_score: 3,
      volume: 20,
      open_count: 12,
      closed_count: 8,
      avg_reactions: 4,
      avg_comments: 3,
      date_first_seen: "2026-03-27T00:00:00.000Z",
      date_last_seen: "2026-04-03T00:00:00.000Z",
      repos_affected: ["anthropics/claude-code"],
    },
    {
      cluster_id: "claude-crash",
      title: "CLI crashes on startup",
      summary: "Startup crashes block routine work.",
      category: "Reliability",
      representative_need: "Fix startup crashes",
      issue_numbers: [3, 4],
      issue_urls: ["https://github.com/anthropics/claude-code/issues/3"],
      sample_titles: ["Crash on boot"],
      demand_score: 8,
      rising_score: 2,
      volume: 15,
      open_count: 9,
      closed_count: 6,
      avg_reactions: 3,
      avg_comments: 2,
      date_first_seen: "2026-03-27T00:00:00.000Z",
      date_last_seen: "2026-04-03T00:00:00.000Z",
      repos_affected: ["anthropics/claude-code"],
    },
  ],
};

const codexAggregation: RepoAggregation = {
  ...baseAggregation,
  repo: "openai/codex",
  display_name: "OpenAI Codex CLI",
  generated_at: "2026-04-03T12:00:00.000Z",
  total_issues_analyzed: 120,
  total_issues_included: 90,
  category_breakdown: { Workflow: 4, Reliability: 1 },
  clusters: [
    {
      ...baseAggregation.clusters[0],
      cluster_id: "codex-agenting",
      title: "Agent workflow control",
      summary: "Codex users want better control over agent execution.",
      category: "Workflow",
      representative_need: "Improve agent control",
      demand_score: 12,
      rising_score: 3,
      volume: 18,
      repos_affected: ["openai/codex"],
    },
    {
      ...baseAggregation.clusters[1],
      cluster_id: "codex-reliability",
      title: "Long-running sessions survive errors",
      summary: "Session continuity matters for big tasks.",
      category: "Reliability",
      representative_need: "Prevent dropped sessions",
      demand_score: 9,
      rising_score: 6,
      volume: 16,
      repos_affected: ["openai/codex"],
    },
  ],
};

const cursorAggregation: RepoAggregation = {
  ...baseAggregation,
  repo: "getcursor/cursor",
  display_name: "Cursor",
  generated_at: "2026-04-02T18:00:00.000Z",
  total_issues_analyzed: 140,
  total_issues_included: 100,
  category_breakdown: { Workflow: 3, UX: 2 },
  clusters: [
    {
      ...baseAggregation.clusters[0],
      cluster_id: "cursor-workflow",
      title: "Inline agent workflow stays predictable",
      summary: "Cursor users want more predictable agent runs.",
      category: "Workflow",
      representative_need: "Predictable agent UX",
      demand_score: 11,
      rising_score: 4,
      volume: 17,
      repos_affected: ["getcursor/cursor"],
    },
    {
      ...baseAggregation.clusters[1],
      cluster_id: "cursor-ux",
      title: "Reduce UI clutter",
      summary: "Busy UI slows scanning.",
      category: "UX",
      representative_need: "Simplify layout",
      demand_score: 7,
      rising_score: 2,
      volume: 14,
      repos_affected: ["getcursor/cursor"],
    },
  ],
};

const configs: RepoConfig[] = [
  {
    repo: "anthropics/claude-code",
    display_name: "Claude Code",
    category: "AI Coding Assistant",
    include_in_homepage: true,
    weight: 1,
  },
  {
    repo: "openai/codex",
    display_name: "OpenAI Codex CLI",
    category: "AI Coding Assistant",
    include_in_homepage: true,
    weight: 1,
  },
  {
    repo: "getcursor/cursor",
    display_name: "Cursor",
    category: "AI Code Editor",
    include_in_homepage: true,
    weight: 1,
  },
];

describe("buildCrossProductSummary", () => {
  it("returns deterministic product cards and hottest signals", () => {
    const summary = buildCrossProductSummary([
      { config: configs[0], aggregation: baseAggregation },
      { config: configs[1], aggregation: codexAggregation },
      { config: configs[2], aggregation: cursorAggregation },
    ]);

    expect(summary.generatedAt).toBe("2026-04-03T12:00:00.000Z");
    expect(summary.products.map((product) => product.slug)).toEqual([
      "openai-codex",
      "getcursor-cursor",
      "anthropics-claude-code",
    ]);

    expect(summary.products[0]).toMatchObject({
      displayName: "OpenAI Codex CLI",
      totalIssuesAnalyzed: 120,
      totalIssuesIncluded: 90,
      totalClusters: 2,
      dominantCategory: "Workflow",
      reportPaths: {
        en: "reports/latest/openai-codex.md",
        zh: "reports/latest/openai-codex.zh.md",
      },
    });
    expect(summary.products[0].topNeed?.title).toBe("Agent workflow control");
    expect(summary.products[0].risingNeed?.title).toBe(
      "Long-running sessions survive errors"
    );

    expect(summary.hottestSignals.slice(0, 4).map((signal) => signal.title)).toEqual([
      "Agent workflow control",
      "Inline agent workflow stays predictable",
      "MCP reliability",
      "Long-running sessions survive errors",
    ]);
    expect(summary.hottestSignals[0]).toMatchObject({
      slug: "openai-codex",
      productName: "OpenAI Codex CLI",
      reportPath: "reports/latest/openai-codex.md",
    });
  });

  it("builds compare-ready shared and unique themes", () => {
    const summary = buildCrossProductSummary([
      { config: configs[0], aggregation: baseAggregation },
      { config: configs[1], aggregation: codexAggregation },
      { config: configs[2], aggregation: cursorAggregation },
    ]);

    expect(summary.sharedThemes).toEqual(["reliability", "workflow"]);
    expect(summary.uniqueThemes).toEqual({
      "anthropics-claude-code": ["integration"],
      "getcursor-cursor": ["ux"],
      "openai-codex": [],
    });
  });
});

describe("writeCrossProductSummary", () => {
  it("skips missing repo aggregations and writes the latest summary artifact", () => {
    const root = mkdtempSync(resolve(tmpdir(), "ryu-cross-product-"));
    const dataDir = resolve(root, "data");
    const outputDir = resolve(root, "reports");

    writeJSON(
      resolve(dataDir, "aggregated", "openai-codex", "clusters.json"),
      codexAggregation
    );

    const summary = writeCrossProductSummary(configs, dataDir, outputDir);
    const artifactPath = resolve(outputDir, "latest", "cross-product.json");
    const artifact = readJSON<CrossProductSummary>(artifactPath);

    expect(summary).not.toBeNull();
    expect(summary?.products.map((product) => product.slug)).toEqual(["openai-codex"]);
    expect(summary?.sharedThemes).toEqual([]);
    expect(existsSync(artifactPath)).toBe(true);
    expect(artifact?.products.map((product) => product.slug)).toEqual(["openai-codex"]);
    expect(artifact?.generatedAt).toBe("2026-04-03T12:00:00.000Z");
  });

  it("uses caller-provided repo configs during report generation", async () => {
    const root = mkdtempSync(resolve(tmpdir(), "ryu-generate-cross-product-"));
    const dataDir = resolve(root, "data");
    const outputDir = resolve(root, "reports");
    const previousCwd = process.cwd();

    writeJSON(
      resolve(dataDir, "aggregated", "openai-codex", "clusters.json"),
      codexAggregation
    );
    writeJSON(
      resolve(dataDir, "aggregated", "anthropics-claude-code", "clusters.json"),
      baseAggregation
    );

    process.chdir(root);

    try {
      await generateReports({
        repo: "openai/codex",
        repoConfig: configs[1],
        repoConfigs: [configs[1]],
        dataDir,
        outputDir,
      });
    } finally {
      process.chdir(previousCwd);
    }

    const artifact = readJSON<CrossProductSummary>(
      resolve(outputDir, "latest", "cross-product.json")
    );

    expect(artifact?.products.map((product) => product.slug)).toEqual([
      "openai-codex",
    ]);
  });
});
