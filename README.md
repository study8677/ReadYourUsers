# ReadYourUsers

> Understand what users actually want by turning public GitHub issues into ranked demand maps.

ReadYourUsers is a TypeScript CLI + static site workflow for turning noisy GitHub issue streams into something product teams can actually use:

- **ranked user needs**
- **rising demand signals**
- **traceable links back to source issues**
- **bilingual reports and a bilingual public site**

**Links:** [Live site](https://study8677.github.io/ReadYourUsers/) · [English site](https://study8677.github.io/ReadYourUsers/en/index.html) · [中文站点](https://study8677.github.io/ReadYourUsers/zh/index.html) · [中文版 README](README.zh.md)

<!-- READYOURUSERS:START -->

## Live snapshot — Claude Code

> 326 issues analyzed from [anthropics/claude-code](https://github.com/anthropics/claude-code) · 33 need clusters · Updated 2026-04-02

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

[Live site](https://study8677.github.io/ReadYourUsers/) | [English site](https://study8677.github.io/ReadYourUsers/en/index.html) | [中文站点](https://study8677.github.io/ReadYourUsers/zh/index.html) | [Full report](reports/latest/anthropics-claude-code.md) | [中文版](README.zh.md) | *Based on public GitHub issues — signal, not census.*

<!-- READYOURUSERS:END -->

## Why this exists

Reading GitHub issues one by one does not scale.

- titles are inconsistent
- duplicates are spread across multiple threads
- urgency is easy to miss
- recent momentum is buried in long issue lists

ReadYourUsers turns that raw stream into a compact demand map you can scan in minutes.

## What you get

- **Ranked needs** — clustered requests with demand scores
- **Rising signals** — what is accelerating right now
- **Traceability** — every insight links back to the original issues
- **Bilingual outputs** — English / Chinese reports and site routes
- **Repeatable workflow** — fetch, analyze, aggregate, publish

## Quick start

### Requirements

- Node.js 18+
- a GitHub token for reading public issues
- an LLM key for Anthropic or OpenAI-compatible APIs

### Install

```bash
npm install
cp .env.example .env
```

### Run the full pipeline

```bash
npx tsx src/cli.ts run anthropics/claude-code
```

### Run step by step

```bash
npx tsx src/cli.ts fetch anthropics/claude-code
npx tsx src/cli.ts analyze anthropics/claude-code
npx tsx src/cli.ts aggregate anthropics/claude-code
npx tsx src/cli.ts generate anthropics/claude-code
```

## How it works

1. **Fetch** — pull public issues from GitHub with caching
2. **Analyze** — use an LLM to extract structured need signals
3. **Aggregate** — cluster similar needs and compute demand / rising scores
4. **Generate** — publish Markdown reports, site pages, and README snapshots

## Outputs

```text
reports/latest/<repo>.md
reports/latest/<repo>.zh.md
reports/archive/<week>/<repo>.md
reports/archive/<week>/<repo>.zh.md
site/en/...
site/zh/...
README.md
README.zh.md
```

## Tracked repositories

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
