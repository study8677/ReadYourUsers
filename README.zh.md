# ReadYourUsers

**语言切换：** [English](README.md) · 中文

> 把 Claude Code、Codex、Cursor 等 AI 编程产品的公开 GitHub Issues 变成一座中英双语需求观测站。

ReadYourUsers 是一个 TypeScript 工作流和公开的多产品观测站，用来把嘈杂的 GitHub issue 流整理成跨 AI 编程产品的周度需求地图：

- **跨产品信号总览**
- **单产品深挖页**
- **正在升温的需求变化**
- **可追溯的 issue 证据链**
- **双语报告、对比页和产品页**

**链接：** [在线网页](https://study8677.github.io/ReadYourUsers/) · [对比页](https://study8677.github.io/ReadYourUsers/zh/compare/index.html) · [English](https://study8677.github.io/ReadYourUsers/en/index.html) · [中文](https://study8677.github.io/ReadYourUsers/zh/index.html) · [English README](README.md)

<!-- READYOURUSERS:START -->

## 实时快照 — Claude Code

> 基于 [anthropics/claude-code](https://github.com/anthropics/claude-code) 的 326 条 issue · 33 个需求簇 · 更新于 2026-04-03

### 当前最强需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | MCP Server Reliability and Configuration Issues | 33 | 15.4 | Integration | [#42632](https://github.com/anthropics/claude-code/issues/42632), [#42628](https://github.com/anthropics/claude-code/issues/42628), [#42627](https://github.com/anthropics/claude-code/issues/42627) |
| 2 | TUI Terminal State and Input Handling Fixes | 51 | 13.8 | UI/UX | [#42638](https://github.com/anthropics/claude-code/issues/42638), [#42617](https://github.com/anthropics/claude-code/issues/42617), [#42613](https://github.com/anthropics/claude-code/issues/42613) |
| 3 | CLI Session Management and UX Improvements | 32 | 7.9 | Developer Experience | [#42637](https://github.com/anthropics/claude-code/issues/42637), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42607](https://github.com/anthropics/claude-code/issues/42607) |
| 4 | Plugin System Management and Reliability | 12 | 6.0 | Developer Experience | [#42601](https://github.com/anthropics/claude-code/issues/42601), [#42595](https://github.com/anthropics/claude-code/issues/42595), [#42568](https://github.com/anthropics/claude-code/issues/42568) |
| 5 | Bug Fixes and Feature Enhancements | 31 | 5.6 | Developer Experience | [#42635](https://github.com/anthropics/claude-code/issues/42635), [#42631](https://github.com/anthropics/claude-code/issues/42631), [#42623](https://github.com/anthropics/claude-code/issues/42623) |
| 6 | Expand Hook System Functionality and Fix Hook Behaviors | 10 | 4.2 | Integration | [#42597](https://github.com/anthropics/claude-code/issues/42597), [#42581](https://github.com/anthropics/claude-code/issues/42581), [#42489](https://github.com/anthropics/claude-code/issues/42489) |
| 7 | Authentication and subscription reliability fixes | 10 | 4.2 | Developer Experience | [#42608](https://github.com/anthropics/claude-code/issues/42608), [#42605](https://github.com/anthropics/claude-code/issues/42605), [#42603](https://github.com/anthropics/claude-code/issues/42603) |
| 8 | Permission System Reliability and Security Fixes | 11 | 4.0 | Security | [#42611](https://github.com/anthropics/claude-code/issues/42611), [#42500](https://github.com/anthropics/claude-code/issues/42500), [#42488](https://github.com/anthropics/claude-code/issues/42488) |
| 9 | Model Response Quality and Instruction Following | 11 | 3.8 | Reliability | [#42636](https://github.com/anthropics/claude-code/issues/42636), [#42634](https://github.com/anthropics/claude-code/issues/42634), [#42633](https://github.com/anthropics/claude-code/issues/42633) |
| 10 | Background Agent Lifecycle and Reliability Management | 8 | 3.7 | Developer Experience | [#42621](https://github.com/anthropics/claude-code/issues/42621), [#42545](https://github.com/anthropics/claude-code/issues/42545), [#42541](https://github.com/anthropics/claude-code/issues/42541) |

### 上升最快

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| TUI Terminal State and Input Handling Fixes | 52.0x | 51 | UI/UX |
| MCP Server Reliability and Configuration Issues | 34.0x | 33 | Integration |
| CLI Session Management and UX Improvements | 33.0x | 32 | Developer Experience |
| Bug Fixes and Feature Enhancements | 32.0x | 31 | Developer Experience |
| Configuration and Settings Management Improvements | 18.0x | 17 | Configuration |

[观测站](https://study8677.github.io/ReadYourUsers/) | [对比页](https://study8677.github.io/ReadYourUsers/zh/compare/index.html) | [产品页](https://study8677.github.io/ReadYourUsers/zh/products/anthropics-claude-code.html) | [完整报告](reports/latest/anthropics-claude-code.zh.md) | [English](README.md) | *基于公开 GitHub Issues，代表需求信号而非全部用户声音。*

<!-- READYOURUSERS:END -->

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

```bash
npm install
cp .env.example .env
```

### 推荐的 OpenRouter 默认配置

```bash
READYOURUSERS_GITHUB_TOKEN=your_github_token
LLM_PROVIDER=openai
OPENAI_API_KEY=your_openrouter_key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENROUTER_HTTP_REFERER=https://github.com/study8677/ReadYourUsers
OPENROUTER_APP_TITLE=ReadYourUsers
ANALYSIS_MODEL=qwen/qwen3.6-plus:free
AGGREGATION_MODEL=qwen/qwen3.6-plus:free
```

### 生成完整观测站

```bash
npx tsx src/cli.ts run
npm run site:build
```

### 钻取单个产品

```bash
npx tsx src/cli.ts run anthropics/claude-code
```

## 工作原理

1. **抓取** — 从 GitHub 拉取公开 issue，并做缓存
2. **分析** — 用 LLM 提取结构化需求信号
3. **聚合** — 聚类相似需求，计算 demand / rising score
4. **生成** — 发布单产品报告、README 快照、跨产品 summary，以及对比页 / 产品页站点路由

## 产物

```text
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
```

## 当前追踪的产品

| 仓库 | 产品 | 分类 |
| --- | --- | --- |
| [anthropics/claude-code](https://github.com/anthropics/claude-code) | Claude Code | AI 编程 CLI |
| [openai/codex](https://github.com/openai/codex) | OpenAI Codex CLI | AI 编程 Agent |
| [getcursor/cursor](https://github.com/getcursor/cursor) | Cursor | AI 代码编辑器 |

## 局限

- **只看公开数据** — 私有支持渠道不包含在内
- **信号不是普查** — issue 数量不等于真实总用户数
- **LLM 总结不是完美的** — 所以必须保留可追溯链接
- **跨产品比较要谨慎** — 不同产品的 GitHub issue 文化并不相同

## Development

```bash
npm run build
npm run site:build
npm test
```

## License

MIT
