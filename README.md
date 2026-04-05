# ReadYourUsers

**Language:** English · [中文](README.zh.md)

> Track what users of Claude Code, Codex, Cursor, and other AI coding products want by turning public GitHub issues into a bilingual demand observatory.

ReadYourUsers is a TypeScript workflow and public multi-product observatory for turning noisy GitHub issue streams into weekly demand maps across AI coding products:

- **cross-product signal maps**
- **product-level deep dives**
- **rising demand shifts**
- **traceable issue evidence**
- **bilingual reports, compare pages, and product routes**

**Links:** [Live site](https://study8677.github.io/ReadYourUsers/) · [Compare](https://study8677.github.io/ReadYourUsers/en/compare/index.html) · [English site](https://study8677.github.io/ReadYourUsers/en/index.html) · [中文站点](https://study8677.github.io/ReadYourUsers/zh/index.html) · [中文版 README](README.zh.md)

<!-- READYOURUSERS:START -->

## Live snapshot — Claude Code

> 2122 issues analyzed from [anthropics/claude-code](https://github.com/anthropics/claude-code) · 25 need clusters · Updated 2026-04-05

### Top needs right now

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | CLI Session Management and Stability Improvements | 2023 | 20.3 | Developer Experience | [#42637](https://github.com/anthropics/claude-code/issues/42637), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42607](https://github.com/anthropics/claude-code/issues/42607) |
| 2 | Custom commands in .claude/commands/ not recognized | 2 | 0.1 | Developer Experience | [#41832](https://github.com/anthropics/claude-code/issues/41832), [#41243](https://github.com/anthropics/claude-code/issues/41243) |
| 3 | Reduce excessive token consumption | 2 | 0.1 | Performance | [#41035](https://github.com/anthropics/claude-code/issues/41035), [#40997](https://github.com/anthropics/claude-code/issues/40997) |
| 4 | Fix excessive token consumption | 2 | 0.0 | Performance | [#42181](https://github.com/anthropics/claude-code/issues/42181), [#40790](https://github.com/anthropics/claude-code/issues/40790) |
| 5 | Preserve transcript and history during subagent execution | 2 | 0.0 | Reliability | [#42283](https://github.com/anthropics/claude-code/issues/42283), [#40892](https://github.com/anthropics/claude-code/issues/40892) |
| 6 | Companion UI visibility toggle setting | 2 | 0.0 | Configuration | [#42287](https://github.com/anthropics/claude-code/issues/42287), [#41942](https://github.com/anthropics/claude-code/issues/41942) |
| 7 | Fix Unexpected High Resource Consumption | 3 | 0.0 | Performance | [#41425](https://github.com/anthropics/claude-code/issues/41425), [#41385](https://github.com/anthropics/claude-code/issues/41385), [#41200](https://github.com/anthropics/claude-code/issues/41200) |
| 8 | Fix MCP connectors not loading in Remote Trigger | 2 | 0.0 | Reliability | [#42599](https://github.com/anthropics/claude-code/issues/42599), [#41934](https://github.com/anthropics/claude-code/issues/41934) |
| 9 | Add settings to disable companion features | 3 | 0.0 | Configuration | [#42506](https://github.com/anthropics/claude-code/issues/42506), [#42212](https://github.com/anthropics/claude-code/issues/42212), [#41091](https://github.com/anthropics/claude-code/issues/41091) |
| 10 | Fix rate limit false positive errors | 2 | 0.0 | Reliability | [#40748](https://github.com/anthropics/claude-code/issues/40748), [#40536](https://github.com/anthropics/claude-code/issues/40536) |

### Rising fastest

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| CLI Session Management and Stability Improvements | 13.9x | 2023 | Developer Experience |
| Fix Unexpected High Resource Consumption | 4.0x | 3 | Performance |
| Add settings to disable companion features | 4.0x | 3 | Configuration |
| MCP connector tools availability in sessions | 4.0x | 3 | Integration |
| Custom commands in .claude/commands/ not recognized | 3.0x | 2 | Developer Experience |

[Observatory](https://study8677.github.io/ReadYourUsers/) | [Compare](https://study8677.github.io/ReadYourUsers/en/compare/index.html) | [Product page](https://study8677.github.io/ReadYourUsers/en/products/anthropics-claude-code.html) | [Full report](reports/latest/anthropics-claude-code.md) | [中文版](README.zh.md) | *Based on public GitHub issues — signal, not census.*

<!-- READYOURUSERS:END -->

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

```bash
npm install
cp .env.example .env
```

### Recommended OpenRouter defaults

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

### Build the full observatory

```bash
npx tsx src/cli.ts run
npm run site:build
```

### Drill into a single product

```bash
npx tsx src/cli.ts run anthropics/claude-code
```

## How it works

1. **Fetch** — pull public issues from GitHub with caching
2. **Analyze** — use an LLM to extract structured need signals
3. **Aggregate** — cluster similar needs and compute demand / rising scores
4. **Generate** — publish per-product reports, README snapshots, cross-product summary artifacts, and compare/product site routes

## Outputs

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

## Development

```bash
npm run build
npm run site:build
npm test
```

## Friends

- [LINUX DO](https://linux.do/) — 真正的技术社区

## License

MIT
