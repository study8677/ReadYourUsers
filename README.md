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

## Live snapshot — Continue

> 38 issues analyzed from [continuedev/continue](https://github.com/continuedev/continue) · 7 need clusters · Updated 2026-04-03

### Top needs right now

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Bug Fixes and Documentation for Multi-Provider Integration | 11 | 2.1 | Developer Experience | [#11999](https://github.com/continuedev/continue/issues/11999), [#11985](https://github.com/continuedev/continue/issues/11985), [#11978](https://github.com/continuedev/continue/issues/11978) |
| 2 | Document config profiles and improve API error handling | 7 | 1.9 | Developer Experience | [#12026](https://github.com/continuedev/continue/issues/12026), [#12004](https://github.com/continuedev/continue/issues/12004), [#11968](https://github.com/continuedev/continue/issues/11968) |
| 3 | Fix API Provider Authentication and Key Configuration | 4 | 1.9 | Configuration | [#12008](https://github.com/continuedev/continue/issues/12008), [#11961](https://github.com/continuedev/continue/issues/11961), [#11956](https://github.com/continuedev/continue/issues/11956) |
| 4 | Fix Response Streaming and Error Handling Bugs | 4 | 1.9 | Reliability | [#11994](https://github.com/continuedev/continue/issues/11994), [#11983](https://github.com/continuedev/continue/issues/11983), [#11926](https://github.com/continuedev/continue/issues/11926) |
| 5 | Fix IDE stability and reliability issues | 3 | 1.4 | Reliability | [#11959](https://github.com/continuedev/continue/issues/11959), [#11932](https://github.com/continuedev/continue/issues/11932), [#11919](https://github.com/continuedev/continue/issues/11919) |
| 6 | Fix Tool Calling Reliability Across AI Providers | 3 | 0.0 | Reliability | [#11976](https://github.com/continuedev/continue/issues/11976), [#11964](https://github.com/continuedev/continue/issues/11964), [#11929](https://github.com/continuedev/continue/issues/11929) |
| 7 | Fix IntelliJ extension resource limits and CPU usage | 2 | 0.0 | Performance | [#11977](https://github.com/continuedev/continue/issues/11977), [#11966](https://github.com/continuedev/continue/issues/11966) |

### Rising fastest

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| Document config profiles and improve API error handling | 8.0x | 7 | Developer Experience |
| Fix API Provider Authentication and Key Configuration | 5.0x | 4 | Configuration |
| Fix IntelliJ extension resource limits and CPU usage | 3.0x | 2 | Performance |
| Bug Fixes and Documentation for Multi-Provider Integration | 1.6x | 11 | Developer Experience |
| Fix IDE stability and reliability issues | 1.5x | 3 | Reliability |

[Observatory](https://study8677.github.io/ReadYourUsers/) | [Compare](https://study8677.github.io/ReadYourUsers/en/compare/index.html) | [Product page](https://study8677.github.io/ReadYourUsers/en/products/continuedev-continue.html) | [Full report](reports/latest/continuedev-continue.md) | [中文版](README.zh.md) | *Based on public GitHub issues — signal, not census.*

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
