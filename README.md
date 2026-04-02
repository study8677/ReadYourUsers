# ReadYourUsers

> Turn public GitHub issues into ranked, readable user-demand maps.
> 把公开 GitHub Issues 转成可追溯、可排序的用户需求地图。

ReadYourUsers is a TypeScript CLI that helps you understand **what users actually want** from developer tools by turning noisy issue streams into structured demand signals.

Instead of manually reading hundreds of GitHub issues, you get:

- **normalized user needs** extracted from each issue
- **clustered demand themes** with human-readable summaries
- **ranked demand and rising signals** to spot what matters now
- **traceable evidence** linking every insight back to original issues
- **bilingual Markdown reports** in English and Chinese

It is built for founders, PMs, open-source maintainers, and anyone who wants a faster read on user demand from public issue data.

<!-- READYOURUSERS:START -->

## AI Coding Tools — What Developers Really Want

> **326** issues analyzed from [anthropics/claude-code](https://github.com/anthropics/claude-code) | **33** need clusters | Updated 2026-04-02

### Top 10 Needs

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

### Rising Needs

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| TUI Terminal State and Input Handling Fixes | 52.0x | 51 | UI/UX |
| MCP Server Reliability and Configuration Issues | 34.0x | 33 | Integration |
| CLI Session Management and UX Improvements | 33.0x | 32 | Developer Experience |
| Bug Fixes and Feature Enhancements | 32.0x | 31 | Developer Experience |
| Configuration and Settings Management Improvements | 18.0x | 17 | Configuration |

[Live site](https://study8677.github.io/ReadYourUsers/) | [Full report](reports/latest/anthropics-claude-code.md) | [中文版](README.zh.md) | *Based on public GitHub issues — signal, not census.*

<!-- READYOURUSERS:END -->

## Why this exists

GitHub issues contain valuable user-demand signals, but they are hard to read at scale:

- issue titles are inconsistent
- duplicate requests are spread across many threads
- urgency is easy to miss
- recent momentum is buried in a long issue list

ReadYourUsers turns that raw stream into a compact demand map you can scan in minutes.

## What the CLI does

### 1. Fetch

Pulls public issues from configured repositories through the GitHub API and stores them locally with incremental caching.

### 2. Analyze

Uses an LLM to extract structured fields from each issue, such as normalized need, module tags, inclusion signals, and supporting metadata.

### 3. Aggregate

Groups related issues into need clusters, summarizes them, and computes:

- **Demand score** — how strong a need appears based on volume, recency, and engagement
- **Rising score** — which needs are accelerating recently

### 4. Generate

Writes Markdown reports to `reports/` and refreshes the auto-generated snapshot section inside `README.md`.

## Quick start

### Requirements

- Node.js 18+
- a GitHub token for reading issues
- an LLM API key for either Anthropic or OpenAI-compatible APIs

### Install

```bash
npm install
cp .env.example .env
```

Then edit `.env`.

### Minimum environment setup

```bash
# Required for GitHub fetching
READYOURUSERS_GITHUB_TOKEN=ghp_xxx

# Choose one provider
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-xxx

# Or
LLM_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-xxx
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

### Build the binary

```bash
npm run build
node dist/cli.js --help
```

After build, the CLI is also exposed as:

```bash
ryu --help
```

## CLI commands

| Command | What it does |
| --- | --- |
| `ryu fetch [repo]` | Fetch raw issues from GitHub and cache them under `data/raw/` |
| `ryu analyze [repo]` | Run structured LLM analysis for fetched issues |
| `ryu aggregate [repo]` | Build need clusters and compute rankings |
| `ryu generate [repo]` | Generate Markdown reports and refresh the README snapshot |
| `ryu run [repo]` | Run the full pipeline end to end |

Use `ryu <command> --help` for command-specific options.

## Tracked repositories

Configured in [`config/repos.json`](config/repos.json):

| Repository | Product | Category | Notes |
| --- | --- | --- | --- |
| `anthropics/claude-code` | Claude Code | AI Coding Assistant | Anthropic's official CLI for Claude |
| `openai/codex` | OpenAI Codex CLI | AI Coding Assistant | OpenAI's coding agent CLI |
| `getcursor/cursor` | Cursor | AI Code Editor | GitHub is not its primary feedback channel |

## Output structure

```text
config/
  repos.json                     # repos to analyze

data/
  raw/<repo-slug>/issues.json    # fetched GitHub issues
  analyzed/<repo-slug>/analyses.json
  aggregated/<repo-slug>/clusters.json

reports/
  latest/<repo-slug>.md          # English report
  latest/<repo-slug>.zh.md       # Chinese report
  archive/<week>/<repo-slug>.md
  archive/<week>/<repo-slug>.zh.md

README.md                        # homepage + auto-refreshed snapshot section
```

## Example output

Current sample reports in this repo:

- [Latest Claude Code report (EN)](reports/latest/anthropics-claude-code.md)

When you run `generate`, the section between `<!-- READYOURUSERS:START -->` and `<!-- READYOURUSERS:END -->` is replaced automatically.

## How ranking works

The current implementation combines a few practical signals:

- **issue volume** in a cluster
- **engagement** such as comments and reactions
- **recency** so newer patterns matter more
- **trend acceleration** to surface rising needs

This is intentionally a signal system, not a statistically rigorous market survey.

## Limitations

- **Public data only** — private support tickets, Slack threads, and sales calls are not included
- **GitHub is not equal across products** — some tools collect feedback elsewhere, so issue volume is not directly comparable
- **LLM summarization can be imperfect** — reports stay traceable by linking back to the original issues
- **README snapshot is generated** — it reflects the latest report you generated locally

## Principles

- **Traceable conclusions** — every cluster links back to original issues
- **Fast to scan** — reports are optimized for ranking and pattern detection
- **Configurable data sources** — repositories are declared in `config/repos.json`
- **Bilingual outputs** — English and Chinese reports are generated together

## Development

```bash
npm run build
npm test
```

Project layout:

- `src/commands/` — CLI command handlers
- `src/pipeline/` — fetch / analyze / aggregate / generate pipeline
- `src/llm/` — provider dispatch and prompts
- `src/scoring/` — demand and rising score logic
- `src/utils/` — cache, markdown, logging, concurrency helpers

## License

MIT
