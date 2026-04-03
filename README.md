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

## Live snapshot — Tabby

> 55 issues analyzed from [TabbyML/tabby](https://github.com/TabbyML/tabby) · 11 need clusters · Updated 2026-04-03

### Top needs right now

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Platform support and deployment flexibility enhancements | 17 | 1.7 | Platform Support | [#4471](https://github.com/TabbyML/tabby/issues/4471), [#4460](https://github.com/TabbyML/tabby/issues/4460), [#4452](https://github.com/TabbyML/tabby/issues/4452) |
| 2 | IDE Plugin Bug Fixes and Context Improvements | 7 | 1.4 | Developer Experience | [#4420](https://github.com/TabbyML/tabby/issues/4420), [#4418](https://github.com/TabbyML/tabby/issues/4418), [#4404](https://github.com/TabbyML/tabby/issues/4404) |
| 3 | Improve Git Integration and Repository Operations | 8 | 1.2 | Developer Experience | [#4451](https://github.com/TabbyML/tabby/issues/4451), [#4449](https://github.com/TabbyML/tabby/issues/4449), [#4431](https://github.com/TabbyML/tabby/issues/4431) |
| 4 | Improve Code Completion Speed and Context Awareness | 2 | 1.0 | Developer Experience | [#4472](https://github.com/TabbyML/tabby/issues/4472), [#4428](https://github.com/TabbyML/tabby/issues/4428) |
| 5 | Improve self-hosted deployment flexibility and configuration | 3 | 0.6 | Configuration | [#4434](https://github.com/TabbyML/tabby/issues/4434), [#4426](https://github.com/TabbyML/tabby/issues/4426), [#4400](https://github.com/TabbyML/tabby/issues/4400) |
| 6 | Expand model support and API integrations | 3 | 0.5 | Integration | [#4422](https://github.com/TabbyML/tabby/issues/4422), [#4412](https://github.com/TabbyML/tabby/issues/4412), [#4374](https://github.com/TabbyML/tabby/issues/4374) |
| 7 | Tabby Agent Code Assistance Improvements | 2 | 0.5 | Developer Experience | [#4411](https://github.com/TabbyML/tabby/issues/4411), [#4384](https://github.com/TabbyML/tabby/issues/4384) |
| 8 | Enhanced configuration file and settings support | 4 | 0.3 | Configuration | [#4401](https://github.com/TabbyML/tabby/issues/4401), [#4358](https://github.com/TabbyML/tabby/issues/4358), [#4356](https://github.com/TabbyML/tabby/issues/4356) |
| 9 | OpenAI/LiteLLM Integration Tool Calling | 2 | 0.2 | Integration | [#4410](https://github.com/TabbyML/tabby/issues/4410), [#4353](https://github.com/TabbyML/tabby/issues/4353) |
| 10 | Fix incorrect information display in CLI and endpoints | 2 | 0.2 | Developer Experience | [#4369](https://github.com/TabbyML/tabby/issues/4369), [#4364](https://github.com/TabbyML/tabby/issues/4364) |

### Rising fastest

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| Platform support and deployment flexibility enhancements | 2.0x | 17 | Platform Support |
| Improve Code Completion Speed and Context Awareness | 2.0x | 2 | Developer Experience |

[Observatory](https://study8677.github.io/ReadYourUsers/) | [Compare](https://study8677.github.io/ReadYourUsers/en/compare/index.html) | [Product page](https://study8677.github.io/ReadYourUsers/en/products/TabbyML-tabby.html) | [Full report](reports/latest/TabbyML-tabby.md) | [中文版](README.zh.md) | *Based on public GitHub issues — signal, not census.*

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

## License

MIT
