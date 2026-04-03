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

> 326 issues analyzed from [anthropics/claude-code](https://github.com/anthropics/claude-code) · 33 need clusters · Updated 2026-04-03

### Top needs right now

| Rank | Need | Issues | Score | Category | Examples |
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

### Rising fastest

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| TUI Terminal State and Input Handling Fixes | 52.0x | 51 | UI/UX |
| MCP Server Reliability and Configuration Issues | 34.0x | 33 | Integration |
| CLI Session Management and UX Improvements | 33.0x | 32 | Developer Experience |
| Bug Fixes and Feature Enhancements | 32.0x | 31 | Developer Experience |
| Configuration and Settings Management Improvements | 18.0x | 17 | Configuration |

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
OPENROUTER_HTTP_REFERER=https://github.com/fanjingwen/ReadYourUsers
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
| [getcursor/cursor](https://github.com/getcursor/cursor) | Cursor | AI Code Editor |

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

## License

MIT
