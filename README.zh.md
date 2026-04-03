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

## 实时快照 — Continue

> 基于 [continuedev/continue](https://github.com/continuedev/continue) 的 38 条 issue · 7 个需求簇 · 更新于 2026-04-03

### 当前最强需求

| 排名 | 需求 | Issue 数 | 得分 | 分类 | 示例 |
| --- | --- | --- | --- | --- | --- |
| 1 | Bug Fixes and Documentation for Multi-Provider Integration | 11 | 2.1 | Developer Experience | [#11999](https://github.com/continuedev/continue/issues/11999), [#11985](https://github.com/continuedev/continue/issues/11985), [#11978](https://github.com/continuedev/continue/issues/11978) |
| 2 | Document config profiles and improve API error handling | 7 | 1.9 | Developer Experience | [#12026](https://github.com/continuedev/continue/issues/12026), [#12004](https://github.com/continuedev/continue/issues/12004), [#11968](https://github.com/continuedev/continue/issues/11968) |
| 3 | Fix API Provider Authentication and Key Configuration | 4 | 1.9 | Configuration | [#12008](https://github.com/continuedev/continue/issues/12008), [#11961](https://github.com/continuedev/continue/issues/11961), [#11956](https://github.com/continuedev/continue/issues/11956) |
| 4 | Fix Response Streaming and Error Handling Bugs | 4 | 1.9 | Reliability | [#11994](https://github.com/continuedev/continue/issues/11994), [#11983](https://github.com/continuedev/continue/issues/11983), [#11926](https://github.com/continuedev/continue/issues/11926) |
| 5 | Fix IDE stability and reliability issues | 3 | 1.4 | Reliability | [#11959](https://github.com/continuedev/continue/issues/11959), [#11932](https://github.com/continuedev/continue/issues/11932), [#11919](https://github.com/continuedev/continue/issues/11919) |
| 6 | Fix Tool Calling Reliability Across AI Providers | 3 | 0.0 | Reliability | [#11976](https://github.com/continuedev/continue/issues/11976), [#11964](https://github.com/continuedev/continue/issues/11964), [#11929](https://github.com/continuedev/continue/issues/11929) |
| 7 | Fix IntelliJ extension resource limits and CPU usage | 2 | 0.0 | Performance | [#11977](https://github.com/continuedev/continue/issues/11977), [#11966](https://github.com/continuedev/continue/issues/11966) |

### 上升最快

| 需求 | 上升倍率 | 本周 | 分类 |
| --- | --- | --- | --- |
| Document config profiles and improve API error handling | 8.0x | 7 | Developer Experience |
| Fix API Provider Authentication and Key Configuration | 5.0x | 4 | Configuration |
| Fix IntelliJ extension resource limits and CPU usage | 3.0x | 2 | Performance |
| Bug Fixes and Documentation for Multi-Provider Integration | 1.6x | 11 | Developer Experience |
| Fix IDE stability and reliability issues | 1.5x | 3 | Reliability |

[观测站](https://study8677.github.io/ReadYourUsers/) | [对比页](https://study8677.github.io/ReadYourUsers/zh/compare/index.html) | [产品页](https://study8677.github.io/ReadYourUsers/zh/products/continuedev-continue.html) | [完整报告](reports/latest/continuedev-continue.zh.md) | [English](README.md) | *基于公开 GitHub Issues，代表需求信号而非全部用户声音。*

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
| [cursor/cursor](https://github.com/cursor/cursor) | Cursor | AI 代码编辑器 |
| [opencode-ai/opencode](https://github.com/opencode-ai/opencode) | OpenCode | AI 编程 Agent |
| [cline/cline](https://github.com/cline/cline) | Cline | IDE 编程 Agent |
| [Aider-AI/aider](https://github.com/Aider-AI/aider) | aider | 终端结对编程助手 |
| [block/goose](https://github.com/block/goose) | Goose | 开源 AI Agent |
| [openclaw/openclaw](https://github.com/openclaw/openclaw) | OpenClaw | 跨平台 AI Agent |
| [google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | Gemini CLI | AI 编程 Agent |
| [RooCodeInc/Roo-Code](https://github.com/RooCodeInc/Roo-Code) | Roo Code | AI 编程 Agent |
| [continuedev/continue](https://github.com/continuedev/continue) | Continue | AI 编程助手 |

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
