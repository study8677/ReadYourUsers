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

## Live snapshot — OpenCode

> 62 issues analyzed from [opencode-ai/opencode](https://github.com/opencode-ai/opencode) · 10 need clusters · Updated 2026-04-03

### Top needs right now

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Model Provider Configuration and Integration Fixes | 14 | 0.3 | Integration | [#352](https://github.com/opencode-ai/opencode/issues/352), [#351](https://github.com/opencode-ai/opencode/issues/351), [#349](https://github.com/opencode-ai/opencode/issues/349) |
| 2 | Improve Installation, Configuration, and CLI Flexibility | 12 | 0.1 | Configuration | [#339](https://github.com/opencode-ai/opencode/issues/339), [#322](https://github.com/opencode-ai/opencode/issues/322), [#319](https://github.com/opencode-ai/opencode/issues/319) |
| 3 | Provider Integration, Model Support, and Tool Improvements | 13 | 0.1 | Integration | [#353](https://github.com/opencode-ai/opencode/issues/353), [#334](https://github.com/opencode-ai/opencode/issues/334), [#313](https://github.com/opencode-ai/opencode/issues/313) |
| 4 | Expand AI Provider Support and Error Handling | 6 | 0.1 | Integration | [#318](https://github.com/opencode-ai/opencode/issues/318), [#305](https://github.com/opencode-ai/opencode/issues/305), [#300](https://github.com/opencode-ai/opencode/issues/300) |
| 5 | Ollama Local LLM Integration Support | 2 | 0.1 | Integration | [#326](https://github.com/opencode-ai/opencode/issues/326), [#296](https://github.com/opencode-ai/opencode/issues/296) |
| 6 | Enhanced Authentication Methods and CLI Support | 4 | 0.1 | Developer Experience | [#343](https://github.com/opencode-ai/opencode/issues/343), [#335](https://github.com/opencode-ai/opencode/issues/335), [#275](https://github.com/opencode-ai/opencode/issues/275) |
| 7 | Terminal Integration and Compatibility Issues | 2 | 0.1 | Integration | [#345](https://github.com/opencode-ai/opencode/issues/345), [#331](https://github.com/opencode-ai/opencode/issues/331) |
| 8 | Fix text input and file search usability issues | 2 | 0.0 | Developer Experience | [#292](https://github.com/opencode-ai/opencode/issues/292), [#273](https://github.com/opencode-ai/opencode/issues/273) |
| 9 | Fix external LLM model provider integrations | 2 | 0.0 | Integration | [#279](https://github.com/opencode-ai/opencode/issues/279), [#252](https://github.com/opencode-ai/opencode/issues/252) |
| 10 | Windows Installation and Extraction Compatibility Fixes | 2 | 0.0 | Platform Support | [#320](https://github.com/opencode-ai/opencode/issues/320), [#306](https://github.com/opencode-ai/opencode/issues/306) |

[Observatory](https://study8677.github.io/ReadYourUsers/) | [Compare](https://study8677.github.io/ReadYourUsers/en/compare/index.html) | [Product page](https://study8677.github.io/ReadYourUsers/en/products/opencode-ai-opencode.html) | [Full report](reports/latest/opencode-ai-opencode.md) | [中文版](README.zh.md) | *Based on public GitHub issues — signal, not census.*

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
