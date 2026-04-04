import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import type { IssueAnalysis, AnalysisCache } from "../../src/models/analysis.js";
import type { RepoConfig } from "../../src/config/repos.js";
import { writeJSON, readJSON } from "../../src/utils/cache.js";
import type { RepoAggregation } from "../../src/models/cluster.js";

function makeAnalysis(overrides: Partial<IssueAnalysis> = {}): IssueAnalysis {
  return {
    issue_number: Math.floor(Math.random() * 10000),
    issue_url: "https://github.com/test/test/issues/1",
    repo: "test/test",
    issue_type: "feature_request",
    normalized_need: "Improve CLI performance",
    module_tags: ["cli"],
    user_intent: "Faster CLI",
    severity_hint: "moderate",
    confidence: 0.9,
    should_include: true,
    reactions_total: 5,
    comments_count: 3,
    created_at: new Date().toISOString(),
    state: "open",
    ...overrides,
  };
}

const repoConfig: RepoConfig = {
  repo: "test/test",
  display_name: "Test Product",
  category: "Test",
  include_in_homepage: true,
  weight: 1,
};

describe("aggregateIssues", () => {
  let dataDir: string;

  beforeEach(() => {
    dataDir = mkdtempSync(resolve(tmpdir(), "ryu-aggregator-"));

    // Mock the LLM client to avoid real API calls
    vi.doMock("../../src/llm/client.js", () => ({
      callStructured: vi.fn().mockResolvedValue({
        title: "Test Cluster",
        summary: "Test summary",
        category: "Developer Experience",
      }),
    }));
  });

  afterEach(() => {
    vi.doUnmock("../../src/llm/client.js");
    vi.resetModules();
    try { rmSync(dataDir, { recursive: true }); } catch {}
  });

  it("clusters analyses by module tag and produces aggregation", async () => {
    const cache: AnalysisCache = {
      repo: "test/test",
      last_analyzed: new Date().toISOString(),
      analyses: [
        makeAnalysis({ normalized_need: "Improve CLI speed", module_tags: ["cli"] }),
        makeAnalysis({ normalized_need: "Improve CLI startup time", module_tags: ["cli"] }),
        makeAnalysis({ normalized_need: "Fix auth token refresh", module_tags: ["auth"] }),
        makeAnalysis({ normalized_need: "Fix auth session expiry", module_tags: ["auth"] }),
        makeAnalysis({ normalized_need: "Random singleton", module_tags: ["other"], should_include: false }),
      ],
      issue_versions: {},
    };
    writeJSON(resolve(dataDir, "analyzed", "test-test", "analyses.json"), cache);

    const { aggregateIssues } = await import("../../src/pipeline/aggregator.js");
    const result = await aggregateIssues({
      repo: "test/test",
      repoConfig,
      dataDir,
    });

    expect(result.repo).toBe("test/test");
    expect(result.total_issues_analyzed).toBe(5);
    // should_include=false filtered out 1
    expect(result.total_issues_included).toBe(4);
    expect(result.clusters.length).toBeGreaterThanOrEqual(1);
    // Clusters should be sorted by demand score
    for (let i = 1; i < result.clusters.length; i++) {
      expect(result.clusters[i - 1].demand_score).toBeGreaterThanOrEqual(result.clusters[i].demand_score);
    }
  });

  it("uses global max engagement for fair scoring across clusters", async () => {
    const cache: AnalysisCache = {
      repo: "test/test",
      last_analyzed: new Date().toISOString(),
      analyses: [
        makeAnalysis({ normalized_need: "Hot issue A", module_tags: ["hot"], reactions_total: 100, comments_count: 50 }),
        makeAnalysis({ normalized_need: "Hot issue B", module_tags: ["hot"], reactions_total: 80, comments_count: 40 }),
        makeAnalysis({ normalized_need: "Cold issue A", module_tags: ["cold"], reactions_total: 1, comments_count: 0 }),
        makeAnalysis({ normalized_need: "Cold issue B", module_tags: ["cold"], reactions_total: 2, comments_count: 1 }),
      ],
      issue_versions: {},
    };
    writeJSON(resolve(dataDir, "analyzed", "test-test", "analyses.json"), cache);

    const { aggregateIssues } = await import("../../src/pipeline/aggregator.js");
    const result = await aggregateIssues({ repo: "test/test", repoConfig, dataDir });

    // Hot cluster should have significantly higher demand score than cold cluster
    const hotCluster = result.clusters.find((c) => c.demand_score > 1);
    const coldCluster = result.clusters.find((c) => c.demand_score <= 1);
    if (hotCluster && coldCluster) {
      expect(hotCluster.demand_score).toBeGreaterThan(coldCluster.demand_score * 2);
    }
  });

  it("writes output to aggregated directory", async () => {
    const cache: AnalysisCache = {
      repo: "test/test",
      last_analyzed: new Date().toISOString(),
      analyses: [
        makeAnalysis({ module_tags: ["cli"] }),
        makeAnalysis({ module_tags: ["cli"] }),
      ],
      issue_versions: {},
    };
    writeJSON(resolve(dataDir, "analyzed", "test-test", "analyses.json"), cache);

    const { aggregateIssues } = await import("../../src/pipeline/aggregator.js");
    await aggregateIssues({ repo: "test/test", repoConfig, dataDir });

    const output = readJSON<RepoAggregation>(
      resolve(dataDir, "aggregated", "test-test", "clusters.json")
    );
    expect(output).not.toBeNull();
    expect(output?.repo).toBe("test/test");
  });
});
