import { resolve } from "node:path";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { mkdirSync } from "node:fs";
import type { RepoAggregation } from "../models/cluster.js";
import { readJSON, writeJSON } from "../utils/cache.js";
import {
  repoSlug,
  type RepoConfig,
} from "../config/repos.js";
import type { CrossProductSummary } from "../models/site.js";
import { buildCrossProductSummary } from "./cross-product.js";
import {
  generateRankingTable,
  generateRisingTable,
  getWeekString,
  type Lang,
} from "../utils/markdown.js";
import { TOP_N_REPORT } from "../config/constants.js";
import { logger } from "../utils/logger.js";

const PUBLIC_SITE_URL = "https://study8677.github.io/ReadYourUsers/";
const PUBLIC_SITE_EN_URL = `${PUBLIC_SITE_URL}en/index.html`;
const PUBLIC_SITE_ZH_URL = `${PUBLIC_SITE_URL}zh/index.html`;
const PUBLIC_SITE_COMPARE_EN_URL = `${PUBLIC_SITE_URL}en/compare/index.html`;
const PUBLIC_SITE_COMPARE_ZH_URL = `${PUBLIC_SITE_URL}zh/compare/index.html`;
const PROJECT_GITHUB_URL = "https://github.com/study8677/ReadYourUsers";

export interface GenerateOptions {
  repo: string;
  repoConfig: RepoConfig;
  repoConfigs: RepoConfig[];
  dataDir: string;
  outputDir: string;
}

export interface GenerateResult {
  repo: string;
  reportPath: string;
  readmeUpdated: boolean;
}

export class MissingAggregatedDataError extends Error {
  readonly repo: string;
  readonly clustersPath: string;

  constructor(repo: string, clustersPath: string) {
    super(`No aggregated data found at ${clustersPath}. Run 'ryu aggregate ${repo}' first.`);
    this.name = "MissingAggregatedDataError";
    this.repo = repo;
    this.clustersPath = clustersPath;
  }
}

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
    .filter(
      (value): value is { config: RepoConfig; aggregation: RepoAggregation } =>
        value !== null
    );

  if (inputs.length === 0) {
    return null;
  }

  const summary = buildCrossProductSummary(inputs);
  writeJSON(resolve(outputDir, "latest", "cross-product.json"), summary);
  return summary;
}

export async function generateReports(
  options: GenerateOptions
): Promise<GenerateResult> {
  const { repo, repoConfig, repoConfigs, dataDir, outputDir } = options;

  const slug = repoSlug(repo);
  const clustersPath = resolve(dataDir, "aggregated", slug, "clusters.json");

  const aggregation = readJSON<RepoAggregation>(clustersPath);
  if (!aggregation || aggregation.clusters.length === 0) {
    throw new MissingAggregatedDataError(repo, clustersPath);
  }

  const week = getWeekString();
  const now = new Date();

  const byDemand = [...aggregation.clusters].sort(
    (a, b) => b.demand_score - a.demand_score
  );
  const byRising = [...aggregation.clusters]
    .filter((c) => c.rising_score > 1)
    .sort((a, b) => b.rising_score - a.rising_score);

  // Generate both English and Chinese reports
  for (const lang of ["en", "zh"] as Lang[]) {
    const report = generateWeeklyReportMd(aggregation, repoConfig, byDemand, byRising, week, now, lang);
    const suffix = lang === "zh" ? ".zh" : "";

    const latestDir = resolve(outputDir, "latest");
    mkdirSync(latestDir, { recursive: true });
    const latestPath = resolve(latestDir, `${slug}${suffix}.md`);
    writeFileSync(latestPath, report, "utf-8");

    const archiveDir = resolve(outputDir, "archive", week);
    mkdirSync(archiveDir, { recursive: true });
    const archivePath = resolve(archiveDir, `${slug}${suffix}.md`);
    writeFileSync(archivePath, report, "utf-8");

    logger.info(`${lang.toUpperCase()} report written to ${latestPath}`);
  }

  const readmeUpdated = updateReadme(
    repo,
    repoConfig,
    aggregation,
    byDemand,
    byRising,
    now
  );

  writeCrossProductSummary(repoConfigs, dataDir, outputDir);

  return {
    repo,
    reportPath: resolve(outputDir, "latest", `${slug}.md`),
    readmeUpdated,
  };
}

// =====================================================
// i18n labels
// =====================================================
const labels = {
  en: {
    reportTitle: (name: string) => `${name} — User Demand Report`,
    week: "Week",
    generated: "Generated",
    issuesAnalyzed: "Issues analyzed",
    included: "included",
    needClusters: "Need clusters",
    topNeeds: "Top 10 User Needs",
    risingNeeds: "Rising Needs",
    categoryBreakdown: "Category Breakdown",
    clusters: "clusters",
    allClusters: "All Need Clusters",
    volume: "Volume",
    issues: "issues",
    open: "open",
    closed: "closed",
    demandScore: "Demand Score",
    avgReactions: "Avg Reactions",
    avgComments: "Avg Comments",
    exampleIssues: "Example issues",
    footer:
      "*This report analyzes public GitHub issues only. It represents a signal from public issue discussions, not the full user base.*",
    generatedBy: `*Generated by [ReadYourUsers](${PROJECT_GITHUB_URL})*`,
  },
  zh: {
    reportTitle: (name: string) => `${name} — 用户需求报告`,
    week: "周",
    generated: "生成日期",
    issuesAnalyzed: "分析 Issue 数",
    included: "纳入分析",
    needClusters: "需求簇",
    topNeeds: "Top 10 用户需求",
    risingNeeds: "上升最快的需求",
    categoryBreakdown: "分类分布",
    clusters: "个簇",
    allClusters: "所有需求簇",
    volume: "数量",
    issues: "条 issue",
    open: "未关闭",
    closed: "已关闭",
    demandScore: "需求得分",
    avgReactions: "平均反应",
    avgComments: "平均评论",
    exampleIssues: "示例 Issue",
    footer:
      "*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*",
    generatedBy: `*由 [ReadYourUsers](${PROJECT_GITHUB_URL}) 生成*`,
  },
} as const;

function generateWeeklyReportMd(
  aggregation: RepoAggregation,
  repoConfig: RepoConfig,
  byDemand: RepoAggregation["clusters"],
  byRising: RepoAggregation["clusters"],
  week: string,
  now: Date,
  lang: Lang
): string {
  const t = labels[lang];
  const lines: string[] = [];

  lines.push(`# ${t.reportTitle(repoConfig.display_name)}`);
  lines.push("");
  lines.push(`**${t.week}:** ${week}`);
  lines.push(`**${t.generated}:** ${now.toISOString().slice(0, 10)}`);
  lines.push(
    `**${t.issuesAnalyzed}:** ${aggregation.total_issues_analyzed} (${aggregation.total_issues_included} ${t.included})`
  );
  lines.push(`**${t.needClusters}:** ${aggregation.clusters.length}`);
  lines.push("");

  lines.push(`## ${t.topNeeds}`);
  lines.push("");
  lines.push(generateRankingTable(byDemand, TOP_N_REPORT, lang));
  lines.push("");

  if (byRising.length > 0) {
    lines.push(`## ${t.risingNeeds}`);
    lines.push("");
    lines.push(generateRisingTable(byRising, 5, lang));
    lines.push("");
  }

  lines.push(`## ${t.categoryBreakdown}`);
  lines.push("");
  const categories = Object.entries(aggregation.category_breakdown)
    .sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of categories) {
    lines.push(`- **${cat}**: ${count} ${t.clusters}`);
  }
  lines.push("");

  lines.push(`## ${t.allClusters}`);
  lines.push("");
  for (let i = 0; i < byDemand.length; i++) {
    const c = byDemand[i];
    lines.push(`### ${i + 1}. ${c.title}`);
    lines.push("");
    lines.push(c.summary);
    lines.push("");
    lines.push(
      `- **${t.volume}:** ${c.volume} ${t.issues} (${c.open_count} ${t.open}, ${c.closed_count} ${t.closed})`
    );
    lines.push(`- **${t.demandScore}:** ${c.demand_score.toFixed(1)}`);
    lines.push(
      `- **${t.avgReactions}:** ${c.avg_reactions} | **${t.avgComments}:** ${c.avg_comments}`
    );

    const issueLinks = c.issue_urls
      .slice(0, 5)
      .map((url) => {
        const num = url.split("/").pop();
        return `[#${num}](${url})`;
      })
      .join(", ");
    lines.push(`- **${t.exampleIssues}:** ${issueLinks}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(t.footer);
  lines.push("");
  lines.push(t.generatedBy);

  return lines.join("\n");
}

function updateReadme(
  repo: string,
  repoConfig: RepoConfig,
  aggregation: RepoAggregation,
  byDemand: RepoAggregation["clusters"],
  byRising: RepoAggregation["clusters"],
  now: Date
): boolean {
  const slug = repoSlug(repo);
  const marker = {
    start: "<!-- READYOURUSERS:START -->",
    end: "<!-- READYOURUSERS:END -->",
  };

  // ===================== English README.md =====================
  writeReadmeFile(
    resolve(process.cwd(), "README.md"),
    marker,
    buildEnglishReadme(repo, repoConfig, slug, aggregation, byDemand, byRising, now)
  );

  // ===================== Chinese README.zh.md =====================
  writeReadmeFile(
    resolve(process.cwd(), "README.zh.md"),
    marker,
    buildChineseReadme(repo, repoConfig, slug, aggregation, byDemand, byRising, now)
  );

  logger.info("README.md + README.zh.md updated");
  return true;
}

function writeReadmeFile(
  path: string,
  marker: { start: string; end: string },
  content: { section: string; fullPage: string }
): void {
  if (existsSync(path)) {
    let readme = readFileSync(path, "utf-8");
    const startIdx = readme.indexOf(marker.start);
    const endIdx = readme.indexOf(marker.end);
    if (startIdx !== -1 && endIdx !== -1) {
      readme =
        readme.slice(0, startIdx) +
        content.section +
        readme.slice(endIdx + marker.end.length);
    } else {
      readme += "\n\n" + content.section;
    }
    writeFileSync(path, readme, "utf-8");
  } else {
    writeFileSync(path, content.fullPage, "utf-8");
  }
}

function buildEnglishReadme(
  repo: string,
  repoConfig: RepoConfig,
  slug: string,
  aggregation: RepoAggregation,
  byDemand: RepoAggregation["clusters"],
  byRising: RepoAggregation["clusters"],
  now: Date
): { section: string; fullPage: string } {
  const s: string[] = [];
  s.push("<!-- READYOURUSERS:START -->");
  s.push("");
  s.push(`## Live snapshot — ${repoConfig.display_name}`);
  s.push("");
  s.push(
    `> ${aggregation.total_issues_analyzed} issues analyzed from [${repo}](https://github.com/${repo}) · ` +
    `${aggregation.clusters.length} need clusters · ` +
    `Updated ${now.toISOString().slice(0, 10)}`
  );
  s.push("");
  s.push("### Top needs right now");
  s.push("");
  s.push(generateRankingTable(byDemand, TOP_N_REPORT, "en"));
  s.push("");
  if (byRising.length > 0) {
    s.push("### Rising fastest");
    s.push("");
    s.push(generateRisingTable(byRising, 5, "en"));
    s.push("");
  }
  s.push(
    `[Observatory](${PUBLIC_SITE_URL}) | ` +
    `[Compare](${PUBLIC_SITE_COMPARE_EN_URL}) | ` +
    `[Product page](${PUBLIC_SITE_URL}en/products/${slug}.html) | ` +
    `[Full report](reports/latest/${slug}.md) | ` +
    `[中文版](README.zh.md) | ` +
    `*Based on public GitHub issues — signal, not census.*`
  );
  s.push("");
  s.push("<!-- READYOURUSERS:END -->");
  const section = s.join("\n");

  const fullPage = `# ReadYourUsers

**Language:** English · [中文](README.zh.md)

> Track what users of Claude Code, Codex, Cursor, and other AI coding products want by turning public GitHub issues into a bilingual demand observatory.

ReadYourUsers is a TypeScript workflow and public multi-product observatory for turning noisy GitHub issue streams into weekly demand maps across AI coding products:

- cross-product signal maps
- product-level deep dives
- rising demand shifts
- traceable issue evidence
- bilingual reports, compare pages, and product routes

**Links:** [Live site](${PUBLIC_SITE_URL}) · [Compare](${PUBLIC_SITE_COMPARE_EN_URL}) · [English site](${PUBLIC_SITE_EN_URL}) · [中文站点](${PUBLIC_SITE_ZH_URL}) · [中文版 README](README.zh.md)

${section}

## Why this exists

If you follow more than one AI coding product, reading GitHub issues repo by repo does not scale.

- titles are inconsistent across repos
- duplicates hide inside different product communities
- urgency is easy to miss in long queues
- cross-product shifts are hard to spot without a shared lens

ReadYourUsers turns that raw stream into a compact observatory you can scan in minutes, then drill into a specific product when something spikes.

## What you get

- **Cross-product observatory** — homepage + compare view for tracked products
- **Product deep dives** — per-product reports and dedicated product pages
- **Rising signals** — what is accelerating right now
- **Traceability** — every insight links back to the original issues
- **Bilingual outputs** — English / Chinese reports and public site routes
- **Repeatable workflow** — fetch, analyze, aggregate, generate, publish

## Quick start

### Requirements

- Node.js 18+
- a GitHub token for reading public issues
- an OpenRouter key (recommended) or another OpenAI-compatible / Anthropic LLM key

### Install

\`\`\`bash
npm install
cp .env.example .env
\`\`\`

### Recommended OpenRouter defaults

\`\`\`bash
READYOURUSERS_GITHUB_TOKEN=your_github_token
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openrouter_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_HTTP_REFERER=${PROJECT_GITHUB_URL}
OPENROUTER_APP_TITLE=ReadYourUsers
ANALYSIS_MODEL=qwen/qwen3.6-plus:free
AGGREGATION_MODEL=qwen/qwen3.6-plus:free
\`\`\`

### Build the full observatory

\`\`\`bash
npx tsx src/cli.ts run
npm run site:build
\`\`\`

### Drill into a single product

\`\`\`bash
npx tsx src/cli.ts run anthropics/claude-code
\`\`\`

## How it works

1. **Fetch** — pull public issues from GitHub with caching
2. **Analyze** — use an LLM to extract structured need signals
3. **Aggregate** — cluster similar needs and compute demand / rising scores
4. **Generate** — publish per-product reports, README snapshots, cross-product summary artifacts, and compare/product site routes

## Outputs

\`\`\`text
reports/latest/<repo>.md
reports/latest/<repo>.zh.md
reports/latest/cross-product.json
reports/archive/<week>/<repo>.md
reports/archive/<week>/<repo>.zh.md
site/en/index.html
site/en/compare/index.html
site/en/products/<slug>.html
site/zh/index.html
site/zh/compare/index.html
site/zh/products/<slug>.html
README.md
README.zh.md
\`\`\`

## Products currently tracked

| Repository | Product | Category |
| --- | --- | --- |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | Claude Code | AI Coding CLI |
| [openai/codex](https://github.com/openai/codex) | OpenAI Codex CLI | AI Coding Agent |
| [cursor/cursor](https://github.com/cursor/cursor) | Cursor | AI Code Editor |
| [opencode-ai/opencode](https://github.com/opencode-ai/opencode) | OpenCode | AI Coding Agent |
| [cline/cline](https://github.com/cline/cline) | Cline | IDE Coding Agent |
| [Aider-AI/aider](https://github.com/Aider-AI/aider) | aider | Terminal Pair Programming |
| [block/goose](https://github.com/block/goose) | Goose | Open-source AI Agent |
| [openclaw/openclaw](https://github.com/openclaw/openclaw) | OpenClaw | Cross-platform AI Agent |
| [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | Gemini CLI | AI Coding Agent |
| [RooCodeInc/Roo-Code](https://github.com/RooCodeInc/Roo-Code) | Roo Code | AI Coding Agent |
| [continuedev/continue](https://github.com/continuedev/continue) | Continue | AI Coding Assistant |
| [microsoft/vscode-copilot-release](https://github.com/microsoft/vscode-copilot-release) | GitHub Copilot Chat for VS Code | AI Coding Assistant |
| [voideditor/void](https://github.com/voideditor/void) | Void | AI Code Editor |
| [zed-industries/zed](https://github.com/zed-industries/zed) | Zed | AI Code Editor |

## Limits

- **Public data only** — private support channels are not included
- **Signal, not census** — issue volume is not the same as total user count
- **LLM summarization is imperfect** — conclusions stay grounded through source links
- **Cross-product comparisons require care** — GitHub issue culture varies by product

## License

MIT
`;
  return { section, fullPage };
}

function buildChineseReadme(
  repo: string,
  repoConfig: RepoConfig,
  slug: string,
  aggregation: RepoAggregation,
  byDemand: RepoAggregation["clusters"],
  byRising: RepoAggregation["clusters"],
  now: Date
): { section: string; fullPage: string } {
  const s: string[] = [];
  s.push("<!-- READYOURUSERS:START -->");
  s.push("");
  s.push(`## 实时快照 — ${repoConfig.display_name}`);
  s.push("");
  s.push(
    `> 基于 [${repo}](https://github.com/${repo}) 的 ${aggregation.total_issues_analyzed} 条 issue · ` +
    `${aggregation.clusters.length} 个需求簇 · ` +
    `更新于 ${now.toISOString().slice(0, 10)}`
  );
  s.push("");
  s.push("### 当前最强需求");
  s.push("");
  s.push(generateRankingTable(byDemand, TOP_N_REPORT, "zh"));
  s.push("");
  if (byRising.length > 0) {
    s.push("### 上升最快");
    s.push("");
    s.push(generateRisingTable(byRising, 5, "zh"));
    s.push("");
  }
  s.push(
    `[观测站](${PUBLIC_SITE_URL}) | ` +
    `[对比页](${PUBLIC_SITE_COMPARE_ZH_URL}) | ` +
    `[产品页](${PUBLIC_SITE_URL}zh/products/${slug}.html) | ` +
    `[完整报告](reports/latest/${slug}.zh.md) | ` +
    `[English](README.md) | ` +
    `*基于公开 GitHub Issues，代表需求信号而非全部用户声音。*`
  );
  s.push("");
  s.push("<!-- READYOURUSERS:END -->");
  const section = s.join("\n");

  const fullPage = `# ReadYourUsers

**语言切换：** [English](README.md) · 中文

> 把 Claude Code、Codex、Cursor 等 AI 编程产品的公开 GitHub Issues 变成一座中英双语需求观测站。

ReadYourUsers 是一个 TypeScript 工作流和公开的多产品观测站，用来把嘈杂的 GitHub issue 流整理成跨 AI 编程产品的周度需求地图：

- 跨产品信号总览
- 单产品深挖页
- 正在升温的需求变化
- 可追溯的 issue 证据链
- 双语报告、对比页和产品页

**链接：** [在线网页](${PUBLIC_SITE_URL}) · [对比页](${PUBLIC_SITE_COMPARE_ZH_URL}) · [English](${PUBLIC_SITE_EN_URL}) · [中文](${PUBLIC_SITE_ZH_URL}) · [English README](README.md)

${section}

## 为什么值得做

如果你同时关注多个 AI 编程产品，按仓库逐个读 GitHub issue 并不能高效回答“用户现在到底想要什么”。

- 不同仓库的标题写法不一致
- 相似需求会分散在不同社区里
- 紧迫度容易被长列表淹没
- 没有统一视角就很难看见跨产品变化

ReadYourUsers 把这些原始讨论压缩成一座几分钟就能扫完的观测站，发现异常后再深入到具体产品。

## 你能得到什么

- **多产品观测站** — 首页 + 对比页快速浏览所有追踪产品
- **产品深挖** — 每个产品都有独立报告和产品页面
- **上升信号** — 最近正在加速出现的问题
- **可追溯证据** — 每条结论都能回到原始 issue
- **双语输出** — 英文 / 中文报告与公开站点路由
- **可复用工作流** — 抓取、分析、聚合、生成、发布一条龙

## 快速开始

### 环境要求

- Node.js 18+
- 用于读取公开 issue 的 GitHub token
- OpenRouter（推荐）或其他 OpenAI 兼容 / Anthropic LLM key

### 安装

\`\`\`bash
npm install
cp .env.example .env
\`\`\`

### 推荐的 OpenRouter 默认配置

\`\`\`bash
READYOURUSERS_GITHUB_TOKEN=your_github_token
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openrouter_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_HTTP_REFERER=${PROJECT_GITHUB_URL}
OPENROUTER_APP_TITLE=ReadYourUsers
ANALYSIS_MODEL=qwen/qwen3.6-plus:free
AGGREGATION_MODEL=qwen/qwen3.6-plus:free
\`\`\`

### 生成完整观测站

\`\`\`bash
npx tsx src/cli.ts run
npm run site:build
\`\`\`

### 钻取单个产品

\`\`\`bash
npx tsx src/cli.ts run anthropics/claude-code
\`\`\`

## 工作原理

1. **抓取** — 从 GitHub 拉取公开 issue，并做缓存
2. **分析** — 用 LLM 提取结构化需求信号
3. **聚合** — 聚类相似需求，计算 demand / rising score
4. **生成** — 发布单产品报告、README 快照、跨产品 summary，以及对比页 / 产品页站点路由

## 产物

\`\`\`text
reports/latest/<repo>.md
reports/latest/<repo>.zh.md
reports/latest/cross-product.json
reports/archive/<week>/<repo>.md
reports/archive/<week>/<repo>.zh.md
site/en/index.html
site/en/compare/index.html
site/en/products/<slug>.html
site/zh/index.html
site/zh/compare/index.html
site/zh/products/<slug>.html
README.md
README.zh.md
\`\`\`

## 当前追踪的产品

| 仓库 | 产品 | 分类 |
| --- | --- | --- |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | Claude Code | AI 编程 CLI |
| [openai/codex](https://github.com/openai/codex) | OpenAI Codex CLI | AI 编程 Agent |
| [cursor/cursor](https://github.com/cursor/cursor) | Cursor | AI 代码编辑器 |
| [opencode-ai/opencode](https://github.com/opencode-ai/opencode) | OpenCode | AI 编程 Agent |
| [cline/cline](https://github.com/cline/cline) | Cline | IDE 编程 Agent |
| [Aider-AI/aider](https://github.com/Aider-AI/aider) | aider | 终端结对编程助手 |
| [block/goose](https://github.com/block/goose) | Goose | 开源 AI Agent |
| [openclaw/openclaw](https://github.com/openclaw/openclaw) | OpenClaw | 跨平台 AI Agent |
| [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | Gemini CLI | AI 编程 Agent |
| [RooCodeInc/Roo-Code](https://github.com/RooCodeInc/Roo-Code) | Roo Code | AI 编程 Agent |
| [continuedev/continue](https://github.com/continuedev/continue) | Continue | AI 编程助手 |
| [microsoft/vscode-copilot-release](https://github.com/microsoft/vscode-copilot-release) | GitHub Copilot Chat for VS Code | AI 编程助手 |
| [voideditor/void](https://github.com/voideditor/void) | Void | AI 代码编辑器 |
| [zed-industries/zed](https://github.com/zed-industries/zed) | Zed | AI 代码编辑器 |

## 局限

- **只看公开数据** — 私有支持渠道不包含在内
- **信号不是普查** — issue 数量不等于真实总用户数
- **LLM 总结不是完美的** — 所以必须保留可追溯链接
- **跨产品比较要谨慎** — 不同产品的 GitHub issue 文化并不相同

## License

MIT
`;
  return { section, fullPage };
}
