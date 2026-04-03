# Multi-Product Observatory Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade ReadYourUsers into a bilingual multi-product observatory with OpenRouter/Qwen support, cross-product summaries, a richer homepage, a compare page, and unified product pages for Claude Code, Codex, and Cursor.

**Architecture:** Keep the existing fetch → analyze → aggregate → generate pipeline intact, then add a deterministic cross-product summary artifact that feeds the site builder. Extend the current OpenAI-compatible LLM path for OpenRouter, keep per-repo report generation working, and let the site render only products with valid generated artifacts so missing data does not break publishing.

**Tech Stack:** TypeScript, Commander, Vitest, Node.js filesystem/path APIs, OpenAI-compatible client (`openai` package), static HTML generation.

---

## File structure map

### Existing files to modify
- `src/llm/client.ts` — OpenAI-compatible client creation and structured-output call path.
- `src/config/constants.ts` — default model fallbacks.
- `src/pipeline/generator.ts` — per-repo report generation and README snapshot logic.
- `src/site/build.ts` — static site assembly and HTML rendering.
- `.env.example` — documented provider configuration.
- `README.md` — English setup and site-positioning copy.
- `README.zh.md` — Chinese setup and site-positioning copy.
- `.github/workflows/weekly-report.yml` — CI defaults for multi-repo/OpenRouter execution.

### New files to create
- `src/models/site.ts` — typed cross-product summary and site-card interfaces.
- `src/pipeline/cross-product.ts` — deterministic aggregation for homepage/compare data.
- `tests/llm/client.test.ts` — OpenRouter/OpenAI-compatible client configuration coverage.
- `tests/pipeline/cross-product.test.ts` — cross-product summary generation coverage.
- `tests/site/build.test.ts` — site rendering coverage for homepage/compare/product routes.

### Generated artifacts expected after implementation
- `reports/latest/cross-product.json`
- `site/en/compare/index.html`
- `site/zh/compare/index.html`
- `site/en/products/<slug>.html`
- `site/zh/products/<slug>.html`

---

### Task 1: Add OpenRouter/Qwen support without breaking the existing LLM abstraction

**Files:**
- Modify: `src/llm/client.ts`
- Modify: `src/config/constants.ts`
- Modify: `.env.example`
- Test: `tests/llm/client.test.ts`

- [ ] **Step 1: Write the failing client configuration test**

```ts
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("getOpenAIClient", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_BASE_URL;
    delete process.env.OPENROUTER_HTTP_REFERER;
    delete process.env.OPENROUTER_APP_TITLE;
  });

  it("passes OpenRouter base URL and headers through the OpenAI-compatible client", async () => {
    process.env.LLM_PROVIDER = "openai";
    process.env.OPENAI_API_KEY = "sk-test";
    process.env.OPENAI_BASE_URL = "https://openrouter.ai/api/v1";
    process.env.OPENROUTER_HTTP_REFERER = "https://readyourusers.test";
    process.env.OPENROUTER_APP_TITLE = "ReadYourUsers";

    const createSpy = vi.fn().mockResolvedValue({
      choices: [{ message: { content: "{\"value\":1}" } }],
    });

    vi.doMock("openai", () => ({
      default: vi.fn().mockImplementation((config) => {
        expect(config.apiKey).toBe("sk-test");
        expect(config.baseURL).toBe("https://openrouter.ai/api/v1");
        expect(config.defaultHeaders).toMatchObject({
          "HTTP-Referer": "https://readyourusers.test",
          "X-Title": "ReadYourUsers",
        });
        return { chat: { completions: { create: createSpy } } };
      }),
    }));

    const { callStructured } = await import("../../src/llm/client.js");
    const { z } = await import("zod");

    await callStructured({
      model: "qwen/qwen3.6-plus:free",
      systemPrompt: "Return JSON",
      userPrompt: "Return JSON",
      schema: z.object({ value: z.number() }),
      schemaName: "TestSchema",
    });

    expect(createSpy).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/llm/client.test.ts`
Expected: FAIL because `tests/llm/client.test.ts` does not exist yet and `src/llm/client.ts` does not pass OpenRouter headers.

- [ ] **Step 3: Implement minimal OpenRouter-aware client configuration and model defaults**

```ts
// src/llm/client.ts
function getOpenAIHeaders(): Record<string, string> | undefined {
  const headers: Record<string, string> = {};

  if (process.env.OPENROUTER_HTTP_REFERER) {
    headers["HTTP-Referer"] = process.env.OPENROUTER_HTTP_REFERER;
  }
  if (process.env.OPENROUTER_APP_TITLE) {
    headers["X-Title"] = process.env.OPENROUTER_APP_TITLE;
  }

  return Object.keys(headers).length > 0 ? headers : undefined;
}

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY not set.");
    }
    openaiClient = new OpenAI({
      apiKey,
      baseURL: process.env.OPENAI_BASE_URL,
      defaultHeaders: getOpenAIHeaders(),
    });
  }
  return openaiClient;
}
```

```ts
// src/config/constants.ts
export const ANALYSIS_MODEL =
  process.env.ANALYSIS_MODEL ??
  (process.env.LLM_PROVIDER === "openai"
    ? "qwen/qwen3.6-plus:free"
    : "claude-haiku-4-5-20241022");

export const AGGREGATION_MODEL =
  process.env.AGGREGATION_MODEL ??
  (process.env.LLM_PROVIDER === "openai"
    ? "qwen/qwen3.6-plus:free"
    : "claude-sonnet-4-5-20241022");
```

```env
# .env.example
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_HTTP_REFERER=https://github.com/fanjingwen/ReadYourUsers
OPENROUTER_APP_TITLE=ReadYourUsers

# Model overrides (optional)
ANALYSIS_MODEL=qwen/qwen3.6-plus:free
AGGREGATION_MODEL=qwen/qwen3.6-plus:free
```

- [ ] **Step 4: Run tests to verify the OpenRouter path passes**

Run: `npm test -- --run tests/llm/client.test.ts`
Expected: PASS with 1 test passing.

- [ ] **Step 5: Commit**

```bash
git add src/llm/client.ts src/config/constants.ts .env.example tests/llm/client.test.ts
git commit -m "Default the OpenAI-compatible path to OpenRouter-friendly settings

This keeps the existing provider abstraction intact while making the current
OpenRouter + Qwen workflow first-class for local runs and CI defaults.

Constraint: Must preserve compatibility with non-OpenRouter OpenAI-compatible endpoints
Rejected: Add a separate openrouter provider enum | unnecessary branch complexity
Confidence: medium
Scope-risk: narrow
Directive: Keep provider-specific behavior limited to client construction and config defaults
Tested: npm test -- --run tests/llm/client.test.ts
Not-tested: Live API call against OpenRouter
"
```

### Task 2: Generate a deterministic cross-product summary artifact from existing per-repo aggregations

**Files:**
- Create: `src/models/site.ts`
- Create: `src/pipeline/cross-product.ts`
- Modify: `src/pipeline/generator.ts`
- Test: `tests/pipeline/cross-product.test.ts`

- [ ] **Step 1: Write the failing cross-product aggregation test**

```ts
import { describe, expect, it } from "vitest";
import { buildCrossProductSummary } from "../../src/pipeline/cross-product.js";
import type { RepoAggregation } from "../../src/models/cluster.js";
import type { RepoConfig } from "../../src/config/repos.js";

const claudeAggregation: RepoAggregation = {
  repo: "anthropics/claude-code",
  display_name: "Claude Code",
  generated_at: "2026-04-03T00:00:00.000Z",
  window_start: "2026-03-27T00:00:00.000Z",
  window_end: "2026-04-03T00:00:00.000Z",
  total_issues_analyzed: 100,
  total_issues_included: 80,
  category_breakdown: { Reliability: 3, Integration: 2 },
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
  category_breakdown: { Workflow: 4 },
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
];

describe("buildCrossProductSummary", () => {
  it("returns homepage cards, hottest signals, and compare-ready data", () => {
    const summary = buildCrossProductSummary([
      { config: configs[0], aggregation: claudeAggregation },
      { config: configs[1], aggregation: codexAggregation },
    ]);

    expect(summary.products).toHaveLength(2);
    expect(summary.products[0].slug).toBe("openai-codex");
    expect(summary.hottestSignals[0].title).toBe("Agent workflow control");
    expect(summary.sharedThemes).toEqual(expect.any(Array));
    expect(summary.generatedAt).toBe("2026-04-03T00:00:00.000Z");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/pipeline/cross-product.test.ts`
Expected: FAIL because `src/pipeline/cross-product.ts` and `src/models/site.ts` do not exist.

- [ ] **Step 3: Implement the summary model and builder**

```ts
// src/models/site.ts
import type { NeedCluster, RepoAggregation } from "./cluster.js";

export interface ProductSummaryCard {
  repo: string;
  slug: string;
  displayName: string;
  category: string;
  generatedAt: string;
  totalIssuesAnalyzed: number;
  totalIssuesIncluded: number;
  totalClusters: number;
  topNeed: NeedCluster | null;
  risingNeed: NeedCluster | null;
  dominantCategory: string | null;
  reportPaths: {
    en: string;
    zh: string;
  };
  aggregation: RepoAggregation;
}

export interface GlobalSignalCard {
  repo: string;
  slug: string;
  productName: string;
  title: string;
  category: string;
  demandScore: number;
  risingScore: number;
  volume: number;
  reportPath: string;
}

export interface CrossProductSummary {
  generatedAt: string;
  products: ProductSummaryCard[];
  hottestSignals: GlobalSignalCard[];
  sharedThemes: string[];
  uniqueThemes: Record<string, string[]>;
}
```

```ts
// src/pipeline/cross-product.ts
import { repoSlug, type RepoConfig } from "../config/repos.js";
import type { NeedCluster, RepoAggregation } from "../models/cluster.js";
import type { CrossProductSummary, ProductSummaryCard } from "../models/site.js";

interface CrossProductInput {
  config: RepoConfig;
  aggregation: RepoAggregation;
}

function dominantCategory(breakdown: Record<string, number>): string | null {
  const entry = Object.entries(breakdown).sort((a, b) => b[1] - a[1])[0];
  return entry?.[0] ?? null;
}

function risingNeed(clusters: NeedCluster[]): NeedCluster | null {
  return [...clusters].filter((cluster) => cluster.rising_score > 1).sort((a, b) => b.rising_score - a.rising_score)[0] ?? null;
}

function buildProductCard({ config, aggregation }: CrossProductInput): ProductSummaryCard {
  const slug = repoSlug(config.repo);
  const sortedByDemand = [...aggregation.clusters].sort((a, b) => b.demand_score - a.demand_score);
  return {
    repo: config.repo,
    slug,
    displayName: config.display_name,
    category: config.category,
    generatedAt: aggregation.generated_at,
    totalIssuesAnalyzed: aggregation.total_issues_analyzed,
    totalIssuesIncluded: aggregation.total_issues_included,
    totalClusters: aggregation.clusters.length,
    topNeed: sortedByDemand[0] ?? null,
    risingNeed: risingNeed(aggregation.clusters),
    dominantCategory: dominantCategory(aggregation.category_breakdown),
    reportPaths: {
      en: `reports/latest/${slug}.md`,
      zh: `reports/latest/${slug}.zh.md`,
    },
    aggregation,
  };
}

export function buildCrossProductSummary(inputs: CrossProductInput[]): CrossProductSummary {
  const products = inputs.map(buildProductCard).sort((a, b) => (b.topNeed?.demand_score ?? 0) - (a.topNeed?.demand_score ?? 0));
  const hottestSignals = products
    .flatMap((product) => product.aggregation.clusters.slice(0, 3).map((cluster) => ({
      repo: product.repo,
      slug: product.slug,
      productName: product.displayName,
      title: cluster.title,
      category: cluster.category,
      demandScore: cluster.demand_score,
      risingScore: cluster.rising_score,
      volume: cluster.volume,
      reportPath: product.reportPaths.en,
    })))
    .sort((a, b) => b.demandScore - a.demandScore)
    .slice(0, 8);

  const categoryOwners = new Map<string, Set<string>>();
  for (const product of products) {
    for (const cluster of product.aggregation.clusters) {
      const key = cluster.category.toLowerCase();
      const current = categoryOwners.get(key) ?? new Set<string>();
      current.add(product.displayName);
      categoryOwners.set(key, current);
    }
  }

  const sharedThemes = [...categoryOwners.entries()]
    .filter(([, owners]) => owners.size > 1)
    .map(([theme]) => theme)
    .sort();

  const uniqueThemes = Object.fromEntries(
    products.map((product) => [
      product.slug,
      product.aggregation.clusters
        .map((cluster) => cluster.category.toLowerCase())
        .filter((theme, index, all) => all.indexOf(theme) === index)
        .filter((theme) => !sharedThemes.includes(theme)),
    ])
  );

  return {
    generatedAt: products[0]?.generatedAt ?? new Date(0).toISOString(),
    products,
    hottestSignals,
    sharedThemes,
    uniqueThemes,
  };
}
```

```ts
// src/pipeline/generator.ts (new helper near generateReports)
import { buildCrossProductSummary } from "./cross-product.js";
import type { CrossProductSummary } from "../models/site.js";

export function writeCrossProductSummary(
  configs: RepoConfig[],
  dataDir: string,
  outputDir: string
): CrossProductSummary | null {
  const inputs = configs
    .map((config) => {
      const aggregation = readJSON<RepoAggregation>(
        resolve(dataDir, "aggregated", repoSlug(config.repo), "clusters.json")
      );
      return aggregation ? { config, aggregation } : null;
    })
    .filter((value): value is { config: RepoConfig; aggregation: RepoAggregation } => value !== null);

  if (inputs.length === 0) return null;

  const summary = buildCrossProductSummary(inputs);
  const latestDir = resolve(outputDir, "latest");
  mkdirSync(latestDir, { recursive: true });
  writeFileSync(resolve(latestDir, "cross-product.json"), JSON.stringify(summary, null, 2), "utf-8");
  return summary;
}
```

- [ ] **Step 4: Run tests to verify the summary builder passes**

Run: `npm test -- --run tests/pipeline/cross-product.test.ts`
Expected: PASS with the cross-product builder test green.

- [ ] **Step 5: Commit**

```bash
git add src/models/site.ts src/pipeline/cross-product.ts src/pipeline/generator.ts tests/pipeline/cross-product.test.ts
git commit -m "Add a deterministic cross-product summary layer for the public site

This introduces a single generated artifact that homepage and compare templates
can consume without duplicating per-repo aggregation logic.

Constraint: Homepage rendering must survive when one configured repo has no generated data
Rejected: Generate homepage data ad hoc inside site/build.ts | too much template coupling
Confidence: medium
Scope-risk: moderate
Directive: Keep the cross-product artifact deterministic; narrative LLM output must remain optional
Tested: npm test -- --run tests/pipeline/cross-product.test.ts
Not-tested: Full site build against real multi-repo data
"
```

### Task 3: Rebuild the static site around homepage, compare, and product routes

**Files:**
- Modify: `src/site/build.ts`
- Modify: `src/pipeline/generator.ts`
- Test: `tests/site/build.test.ts`

- [ ] **Step 1: Write the failing site rendering tests**

```ts
import { describe, expect, it } from "vitest";
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";

describe("site build", () => {
  it("renders compare and product routes from cross-product summary data", async () => {
    const root = mkdtempSync(resolve(tmpdir(), "ryu-site-"));
    mkdirSync(resolve(root, "reports", "latest"), { recursive: true });

    writeFileSync(
      resolve(root, "reports", "latest", "cross-product.json"),
      JSON.stringify({
        generatedAt: "2026-04-03T00:00:00.000Z",
        products: [
          {
            repo: "anthropics/claude-code",
            slug: "anthropics-claude-code",
            displayName: "Claude Code",
            category: "AI Coding Assistant",
            generatedAt: "2026-04-03T00:00:00.000Z",
            totalIssuesAnalyzed: 100,
            totalIssuesIncluded: 80,
            totalClusters: 5,
            dominantCategory: "Integration",
            topNeed: { title: "MCP reliability", summary: "", category: "Integration", demand_score: 10, rising_score: 3, volume: 20 },
            risingNeed: { title: "MCP reliability", summary: "", category: "Integration", demand_score: 10, rising_score: 3, volume: 20 },
            reportPaths: { en: "reports/latest/anthropics-claude-code.md", zh: "reports/latest/anthropics-claude-code.zh.md" },
            aggregation: { clusters: [], category_breakdown: {} },
          },
        ],
        hottestSignals: [
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
        uniqueThemes: { "anthropics-claude-code": ["integration"] },
      }),
      "utf-8"
    );

    process.chdir(root);
    await import("../../src/site/build.js");

    const compareHtml = readFileSync(resolve(root, "site", "en", "compare", "index.html"), "utf-8");
    const productHtml = readFileSync(resolve(root, "site", "en", "products", "anthropics-claude-code.html"), "utf-8");

    expect(compareHtml).toContain("Compare");
    expect(compareHtml).toContain("MCP reliability");
    expect(productHtml).toContain("Claude Code");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/site/build.test.ts`
Expected: FAIL because compare/product routes do not exist and `src/site/build.ts` only builds the current homepage/latest/archive set.

- [ ] **Step 3: Refactor the site builder to consume the cross-product summary and render unified routes**

```ts
// src/site/build.ts (add near top-level types)
import type { CrossProductSummary, ProductSummaryCard } from "../models/site.js";

function readCrossProductSummary(): CrossProductSummary | null {
  return readJson<CrossProductSummary>(resolve(REPORTS_DIR, "latest", "cross-product.json"));
}

function buildComparePage(uiLang: UiLang, summary: CrossProductSummary): string {
  const t = ui[uiLang];
  const cards = summary.hottestSignals
    .map(
      (signal) => `
        <article class="signal-card">
          <p class="signal-product">${escapeHtml(signal.productName)}</p>
          <h3>${escapeHtml(signal.title)}</h3>
          <p>${escapeHtml(signal.category)} · ${signal.volume} ${t.clusterIssues}</p>
        </article>`
    )
    .join("");

  return renderPage({
    uiLang,
    title: `${t.navCompare} — ${t.siteName}`,
    description: t.compareIntroCopy,
    body: `
      <section class="hero-panel">
        <p class="eyebrow">${t.compareIntroEyebrow}</p>
        <h1>${t.compareIntroTitle}</h1>
        <p>${t.compareIntroCopy}</p>
      </section>
      <section class="signal-grid">${cards}</section>
    `,
  });
}

function buildProductPage(uiLang: UiLang, product: ProductSummaryCard): string {
  const t = ui[uiLang];
  return renderPage({
    uiLang,
    title: `${product.displayName} — ${t.siteName}`,
    description: product.topNeed?.summary ?? "",
    body: `
      <section class="hero-panel">
        <p class="eyebrow">${t.productEyebrow}</p>
        <h1>${escapeHtml(product.displayName)}</h1>
        <p>${escapeHtml(product.topNeed?.title ?? "")}</p>
      </section>
      <section class="stats-grid">
        <article class="stat-card"><span>${t.statsIssues}</span><strong>${product.totalIssuesAnalyzed}</strong></article>
        <article class="stat-card"><span>${t.statsClusters}</span><strong>${product.totalClusters}</strong></article>
      </section>
    `,
  });
}
```

```ts
// src/site/build.ts (inside build main flow)
const summary = readCrossProductSummary();
if (summary) {
  for (const uiLang of UI_LANGS) {
    writeText(absoluteSitePath(routeFor(uiLang, "compare/index.html")), buildComparePage(uiLang, summary));
    for (const product of summary.products) {
      writeText(
        absoluteSitePath(routeFor(uiLang, `products/${product.slug}.html`)),
        buildProductPage(uiLang, product)
      );
    }
  }
}
```

```ts
// src/site/build.ts (expand UI labels)
navCompare: "Compare",
navProducts: "Products",
compareIntroEyebrow: "Cross-product signals",
compareIntroTitle: "Where the products diverge",
compareIntroCopy: "Compare what Claude Code, Codex, and Cursor users care about this week.",
productEyebrow: "Product snapshot",
```

- [ ] **Step 4: Run tests and the site build**

Run: `npm test -- --run tests/site/build.test.ts && npm run site:build`
Expected: PASS for the test file and `Site generated at .../site` from the build command.

- [ ] **Step 5: Commit**

```bash
git add src/site/build.ts src/pipeline/generator.ts tests/site/build.test.ts
git commit -m "Reframe the static site around multi-product discovery routes

This replaces the single-report presentation with a homepage-supported compare
surface and dedicated product pages while preserving report/archive access.

Constraint: Must preserve bilingual route generation
Rejected: Leave compare/product views as markdown-only pages | too weak for public storytelling
Confidence: medium
Scope-risk: moderate
Directive: Homepage, compare, and product pages should share one visual system instead of diverging into separate microsites
Tested: npm test -- --run tests/site/build.test.ts && npm run site:build
Not-tested: Visual QA in a browser against production content
"
```

### Task 4: Refresh copy, README, and CI defaults so the public experience matches the new product direction

**Files:**
- Modify: `README.md`
- Modify: `README.zh.md`
- Modify: `.github/workflows/weekly-report.yml`
- Modify: `src/pipeline/generator.ts`

- [ ] **Step 1: Write the failing workflow and README assertions**

```ts
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("public docs and automation", () => {
  it("documents OpenRouter defaults and multi-product positioning", () => {
    const readme = readFileSync("README.md", "utf-8");
    const workflow = readFileSync(".github/workflows/weekly-report.yml", "utf-8");

    expect(readme).toContain("OpenRouter");
    expect(readme).toContain("Codex");
    expect(readme).toContain("Compare");
    expect(workflow).toContain("qwen/qwen3.6-plus:free");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- --run tests/site/build.test.ts`
Expected: FAIL because the README and workflow still point to GPT defaults and the copy still centers the old single-report framing.

- [ ] **Step 3: Update docs, README snapshot copy, and CI defaults**

```md
<!-- README.md hero excerpt -->
ReadYourUsers is a TypeScript workflow and public observatory for turning noisy GitHub issue streams into weekly demand maps across AI coding products.

- cross-product signals
- product-level deep dives
- rising demand shifts
- bilingual reports and site routes
```

```md
<!-- README.md setup excerpt -->
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openrouter_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
ANALYSIS_MODEL=qwen/qwen3.6-plus:free
AGGREGATION_MODEL=qwen/qwen3.6-plus:free
```

```yaml
# .github/workflows/weekly-report.yml
          ANALYSIS_MODEL: ${{ vars.ANALYSIS_MODEL || 'qwen/qwen3.6-plus:free' }}
          AGGREGATION_MODEL: ${{ vars.AGGREGATION_MODEL || 'qwen/qwen3.6-plus:free' }}
```

```ts
// src/pipeline/generator.ts (README block copy)
ReadYourUsers is a TypeScript workflow and public observatory for tracking what users of major AI coding products want right now:

- cross-product signal maps
- rising themes
- traceable issue evidence
- bilingual reports and a bilingual public site
```

- [ ] **Step 4: Run the focused test and site generation commands**

Run: `npm test -- --run tests/site/build.test.ts && npm run site:build`
Expected: PASS and updated generated README/site content.

- [ ] **Step 5: Commit**

```bash
git add README.md README.zh.md .github/workflows/weekly-report.yml src/pipeline/generator.ts
git commit -m "Align public docs and automation with the observatory launch

The repository front door and scheduled pipeline should both reflect the
multi-product observatory positioning and current OpenRouter/Qwen default path.

Constraint: README snapshots must stay compatible with generated sections
Rejected: Keep workflow on GPT defaults while documenting OpenRouter locally | misleading operational split
Confidence: medium
Scope-risk: narrow
Directive: Keep README marketing copy and generator output copy in sync whenever positioning changes
Tested: npm test -- --run tests/site/build.test.ts && npm run site:build
Not-tested: GitHub Actions run with repository secrets
"
```

### Task 5: Verify the multi-product pipeline with Codex enabled and graceful fallback behavior for missing products

**Files:**
- Modify: `package.json` (if a smoke script is added)
- Modify: `config/repos.json` (only if weights/labels need tuning)
- Modify: `src/site/build.ts` (only if fallback defects appear)
- Test inputs: existing `data/`, `reports/`, and generated `site/`

- [ ] **Step 1: Add an end-to-end smoke test script entry if needed**

```json
// package.json
{
  "scripts": {
    "verify:smoke": "tsx src/cli.ts generate --verbose && npm run site:build"
  }
}
```

- [ ] **Step 2: Run Codex-only pipeline steps with OpenRouter env set**

Run:

```bash
LLM_PROVIDER=openai \
OPENAI_API_KEY="$OPENAI_API_KEY" \
OPENAI_BASE_URL="https://openrouter.ai/api/v1" \
ANALYSIS_MODEL="qwen/qwen3.6-plus:free" \
AGGREGATION_MODEL="qwen/qwen3.6-plus:free" \
npx tsx src/cli.ts run openai/codex --verbose
```

Expected: Codex fetch/analyze/aggregate/generate completes and writes `reports/latest/openai-codex.md` plus `.zh.md`.

- [ ] **Step 3: Run full-site generation across all available repos**

Run:

```bash
LLM_PROVIDER=openai \
OPENAI_API_KEY="$OPENAI_API_KEY" \
OPENAI_BASE_URL="https://openrouter.ai/api/v1" \
ANALYSIS_MODEL="qwen/qwen3.6-plus:free" \
AGGREGATION_MODEL="qwen/qwen3.6-plus:free" \
npx tsx src/cli.ts generate --verbose && npm run site:build
```

Expected:
- `reports/latest/cross-product.json` exists
- `site/en/compare/index.html` exists
- `site/zh/compare/index.html` exists
- `site/en/products/openai-codex.html` exists if Codex data was generated
- homepage still renders if one configured product is missing

- [ ] **Step 4: Run the full automated test suite and inspect git diff**

Run: `npm test && npm run build && npm run site:build && git diff --stat`
Expected:
- all tests pass
- TypeScript build passes
- site build passes
- diff includes new routes/artifacts without unexpected churn in unrelated files

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json config/repos.json data reports site
git commit -m "Verify the observatory flow against Codex and multi-product outputs

This locks in the first public-ready data path for Codex and confirms the site
still renders cleanly when repo availability changes.

Constraint: Verification must not depend on every configured repo being healthy on every run
Rejected: Block publish unless all three repos succeed | too brittle for scheduled generation
Confidence: medium
Scope-risk: moderate
Directive: Treat partial product availability as a first-class state, not an error condition, in future site changes
Tested: npm test && npm run build && npm run site:build && npx tsx src/cli.ts run openai/codex --verbose
Not-tested: Full three-product live run including Cursor on a fresh cache
"
```

---

## Self-review

### Spec coverage
- OpenRouter/Qwen provider path: covered by Task 1.
- Cross-product summary artifact: covered by Task 2.
- Richer homepage/compare/product routes: covered by Task 3.
- Public-facing README/workflow alignment: covered by Task 4.
- Codex-first verification and graceful fallback: covered by Task 5.

### Placeholder scan
- No `TODO`, `TBD`, or "implement later" placeholders remain.
- Every task includes concrete file paths, code snippets, commands, and expected outcomes.

### Type consistency
- Cross-product types are centralized in `src/models/site.ts` and reused by the builder and site renderer.
- OpenRouter-related env names are consistent across `.env.example`, workflow config, and test expectations.
