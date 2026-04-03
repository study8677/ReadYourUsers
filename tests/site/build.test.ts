import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { RepoConfig } from "../../src/config/repos.js";
import type { RepoAggregation } from "../../src/models/cluster.js";
import type { CrossProductSummary } from "../../src/models/site.js";

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
];

const claudeAggregation: RepoAggregation = {
  repo: "anthropics/claude-code",
  display_name: "Claude Code",
  generated_at: "2026-04-03T00:00:00.000Z",
  window_start: "2026-03-27T00:00:00.000Z",
  window_end: "2026-04-03T00:00:00.000Z",
  total_issues_analyzed: 100,
  total_issues_included: 80,
  category_breakdown: { Integration: 3, Reliability: 1 },
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
  ],
};

const codexAggregation: RepoAggregation = {
  ...claudeAggregation,
  repo: "openai/codex",
  display_name: "OpenAI Codex CLI",
  generated_at: "2026-04-03T12:00:00.000Z",
  total_issues_analyzed: 120,
  total_issues_included: 90,
  category_breakdown: { Workflow: 4 },
  clusters: [
    {
      ...claudeAggregation.clusters[0],
      cluster_id: "codex-agenting",
      title: "Agent workflow control",
      summary: "Codex users want better control over agent execution.",
      category: "Workflow",
      representative_need: "Improve agent control",
      demand_score: 12,
      rising_score: 5,
      volume: 18,
      repos_affected: ["openai/codex"],
    },
  ],
};

const summary: CrossProductSummary = {
  generatedAt: "2026-04-03T12:00:00.000Z",
  products: [
    {
      repo: "openai/codex",
      slug: "openai-codex",
      displayName: "OpenAI Codex CLI",
      category: "AI Coding Assistant",
      generatedAt: "2026-04-03T12:00:00.000Z",
      totalIssuesAnalyzed: 120,
      totalIssuesIncluded: 90,
      totalClusters: 1,
      topNeed: codexAggregation.clusters[0],
      risingNeed: codexAggregation.clusters[0],
      dominantCategory: "Workflow",
      reportPaths: {
        en: "reports/latest/openai-codex.md",
        zh: "reports/latest/openai-codex.zh.md",
      },
      aggregation: codexAggregation,
    },
    {
      repo: "anthropics/claude-code",
      slug: "anthropics-claude-code",
      displayName: "Claude Code",
      category: "AI Coding Assistant",
      generatedAt: "2026-04-03T00:00:00.000Z",
      totalIssuesAnalyzed: 100,
      totalIssuesIncluded: 80,
      totalClusters: 1,
      topNeed: claudeAggregation.clusters[0],
      risingNeed: claudeAggregation.clusters[0],
      dominantCategory: "Integration",
      reportPaths: {
        en: "reports/latest/anthropics-claude-code.md",
        zh: "reports/latest/anthropics-claude-code.zh.md",
      },
      aggregation: claudeAggregation,
    },
  ],
  hottestSignals: [
    {
      repo: "openai/codex",
      slug: "openai-codex",
      productName: "OpenAI Codex CLI",
      title: "Agent workflow control",
      category: "Workflow",
      demandScore: 12,
      risingScore: 5,
      volume: 18,
      reportPath: "reports/latest/openai-codex.md",
    },
    {
      repo: "anthropics/claude-code",
      slug: "anthropics-claude-code",
      productName: "Claude Code",
      title: "MCP reliability",
      category: "Integration",
      demandScore: 10,
      risingScore: 3,
      volume: 20,
      reportPath: "reports/latest/anthropics-claude-code.md",
    },
  ],
  sharedThemes: [],
  uniqueThemes: {
    "anthropics-claude-code": ["integration"],
    "openai-codex": ["workflow"],
  },
};

const previousCwd = process.cwd();

function writeJson(path: string, value: unknown) {
  mkdirSync(resolve(path, ".."), { recursive: true });
  writeFileSync(path, JSON.stringify(value, null, 2), "utf-8");
}

function writeReportPair(root: string, slug: string, title: string) {
  mkdirSync(resolve(root, "reports", "latest"), { recursive: true });
  writeFileSync(resolve(root, "reports", "latest", `${slug}.md`), `# ${title}\n\nEnglish latest report.`, "utf-8");
  writeFileSync(resolve(root, "reports", "latest", `${slug}.zh.md`), `# ${title}\n\n中文最新报告。`, "utf-8");
}

function createWorkspace(includeSummary: boolean): string {
  const root = mkdtempSync(resolve(tmpdir(), "ryu-site-"));
  writeJson(resolve(root, "config", "repos.json"), { repos: configs });
  writeJson(
    resolve(root, "data", "aggregated", "anthropics-claude-code", "clusters.json"),
    claudeAggregation
  );
  writeJson(
    resolve(root, "data", "aggregated", "openai-codex", "clusters.json"),
    codexAggregation
  );
  writeReportPair(root, "anthropics-claude-code", "Claude Code");
  writeReportPair(root, "openai-codex", "OpenAI Codex CLI");

  if (includeSummary) {
    writeJson(resolve(root, "reports", "latest", "cross-product.json"), summary);
  }

  return root;
}

afterEach(() => {
  process.chdir(previousCwd);
  vi.resetModules();
});

describe("site build", () => {
  it("renders compare and product routes from cross-product summary data", async () => {
    const root = createWorkspace(true);

    const { buildSite } = await import("../../src/site/build.js");
    expect(existsSync(resolve(root, "site", ".nojekyll"))).toBe(false);

    buildSite(root);

    const compareHtml = readFileSync(
      resolve(root, "site", "en", "compare", "index.html"),
      "utf-8"
    );
    const zhCompareHtml = readFileSync(
      resolve(root, "site", "zh", "compare", "index.html"),
      "utf-8"
    );
    const productHtml = readFileSync(
      resolve(root, "site", "en", "products", "anthropics-claude-code.html"),
      "utf-8"
    );
    const zhProductHtml = readFileSync(
      resolve(root, "site", "zh", "products", "anthropics-claude-code.html"),
      "utf-8"
    );

    expect(compareHtml).toContain("Compare");
    expect(compareHtml).toContain("Agent workflow control");
    expect(compareHtml).toContain("Claude Code");
    expect(zhCompareHtml).toContain("Claude Code");
    expect(productHtml).toContain("Claude Code");
    expect(productHtml).toContain("MCP reliability");
    expect(zhProductHtml).toContain("Claude Code");
    expect(productHtml).toContain("../../en/latest/anthropics-claude-code.html");
  });





  it("escapes compare intro copy product names", async () => {
    const root = createWorkspace(true);
    const injectedName = 'Codex <img src=x onerror="alert(1)">';
    const injectedSummary = {
      ...summary,
      products: summary.products.map((product) =>
        product.slug === "openai-codex"
          ? { ...product, displayName: injectedName }
          : product
      ),
      hottestSignals: summary.hottestSignals.map((signal) =>
        signal.slug === "openai-codex"
          ? { ...signal, productName: injectedName }
          : signal
      ),
    };

    writeJson(resolve(root, "reports", "latest", "cross-product.json"), injectedSummary);

    const { buildSite } = await import("../../src/site/build.js");
    buildSite(root);

    const compareHtml = readFileSync(
      resolve(root, "site", "en", "compare", "index.html"),
      "utf-8"
    );

    expect(compareHtml).toContain('See where Codex &lt;img src=x onerror=&quot;alert(1)&quot;&gt; and Claude Code users overlap and diverge this week.');
    expect(compareHtml).not.toContain('<img src=x onerror="alert(1)"> users overlap and diverge this week.');
  });

  it("does not name missing configured products in compare copy", async () => {
    const root = createWorkspace(true);

    writeJson(resolve(root, "config", "repos.json"), {
      repos: [
        ...configs,
        {
          repo: "getcursor/cursor",
          display_name: "Cursor",
          category: "AI Code Editor",
          include_in_homepage: true,
          weight: 0.8,
        },
      ],
    });

    const { buildSite } = await import("../../src/site/build.js");
    buildSite(root);

    const compareHtml = readFileSync(
      resolve(root, "site", "en", "compare", "index.html"),
      "utf-8"
    );

    expect(compareHtml).toContain("OpenAI Codex CLI");
    expect(compareHtml).toContain("Claude Code");
    expect(compareHtml).not.toContain("Cursor users overlap and diverge this week.");
  });

  it("keeps the build working when cross-product summary data is missing", async () => {
    const root = createWorkspace(false);

    const { buildSite } = await import("../../src/site/build.js");
    expect(existsSync(resolve(root, "site", ".nojekyll"))).toBe(false);

    buildSite(root);

    expect(existsSync(resolve(root, "site", "en", "index.html"))).toBe(true);
    expect(existsSync(resolve(root, "site", "en", "latest", "openai-codex.html"))).toBe(true);
    expect(existsSync(resolve(root, "site", "en", "compare", "index.html"))).toBe(true);

    const compareHtml = readFileSync(
      resolve(root, "site", "en", "compare", "index.html"),
      "utf-8"
    );
    expect(compareHtml).toContain("Compare");
  });
});
