import {
  generateRankingTable,
  generateRisingTable,
} from "../utils/markdown.js";
import {
  TOP_N_REPORT,
  PROJECT_GITHUB_URL,
  PUBLIC_SITE_URL,
  PUBLIC_SITE_EN_URL,
  PUBLIC_SITE_ZH_URL,
  PUBLIC_SITE_COMPARE_EN_URL,
  PUBLIC_SITE_COMPARE_ZH_URL,
} from "../config/constants.js";
import {
  repoSlug,
  type RepoConfig,
} from "../config/repos.js";
import type { RepoAggregation } from "../models/cluster.js";

export function buildEnglishReadme(
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
| [OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) | OpenHands | AI-Driven Development |
| [TabbyML/tabby](https://github.com/TabbyML/tabby) | Tabby | Self-hosted AI Coding Assistant |

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

export function buildChineseReadme(
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

如果你同时关注多个 AI 编程产品，按仓库逐个读 GitHub issue 并不能高效回答"用户现在到底想要什么"。

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
| [OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) | OpenHands | AI 驱动开发平台 |
| [TabbyML/tabby](https://github.com/TabbyML/tabby) | Tabby | 自托管 AI 编程助手 |

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
