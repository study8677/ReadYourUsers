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

## Live snapshot — Zed

> 37 issues analyzed from [zed-industries/zed](https://github.com/zed-industries/zed) · 8 need clusters · Updated 2026-04-03

### Top needs right now

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Bug Fixes and Edge Case Improvements | 13 | 3.6 | Developer Experience | [#53087](https://github.com/zed-industries/zed/issues/53087), [#53081](https://github.com/zed-industries/zed/issues/53081), [#53059](https://github.com/zed-industries/zed/issues/53059) |
| 2 | Git Panel and Graph Bug Fixes | 7 | 2.8 | Reliability | [#53080](https://github.com/zed-industries/zed/issues/53080), [#53069](https://github.com/zed-industries/zed/issues/53069), [#53064](https://github.com/zed-industries/zed/issues/53064) |
| 3 | AI Agent Integration Fixes | 3 | 2.2 | Integration | [#53034](https://github.com/zed-industries/zed/issues/53034), [#53006](https://github.com/zed-industries/zed/issues/53006), [#52983](https://github.com/zed-industries/zed/issues/52983) |
| 4 | Agent Panel Stability and Usability Fixes | 4 | 2.0 | Developer Experience | [#53072](https://github.com/zed-industries/zed/issues/53072), [#53070](https://github.com/zed-industries/zed/issues/53070), [#53021](https://github.com/zed-industries/zed/issues/53021) |
| 5 | Immediate Keybinding and Settings Reload | 2 | 1.8 | Configuration | [#53012](https://github.com/zed-industries/zed/issues/53012), [#53003](https://github.com/zed-industries/zed/issues/53003) |
| 6 | Fix editor rendering and font loading bugs | 2 | 1.2 | Developer Experience | [#53051](https://github.com/zed-industries/zed/issues/53051), [#52987](https://github.com/zed-industries/zed/issues/52987) |
| 7 | Terminal interaction and shell command fixes | 3 | 1.2 | Developer Experience | [#53056](https://github.com/zed-industries/zed/issues/53056), [#53046](https://github.com/zed-industries/zed/issues/53046), [#52985](https://github.com/zed-industries/zed/issues/52985) |
| 8 | UI/UX Bug Fixes | 3 | 1.0 | UI/UX | [#53062](https://github.com/zed-industries/zed/issues/53062), [#53060](https://github.com/zed-industries/zed/issues/53060), [#53005](https://github.com/zed-industries/zed/issues/53005) |

### Rising fastest

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| Bug Fixes and Edge Case Improvements | 14.0x | 13 | Developer Experience |
| Git Panel and Graph Bug Fixes | 8.0x | 7 | Reliability |
| Agent Panel Stability and Usability Fixes | 5.0x | 4 | Developer Experience |
| AI Agent Integration Fixes | 4.0x | 3 | Integration |
| Terminal interaction and shell command fixes | 4.0x | 3 | Developer Experience |

[Observatory](https://study8677.github.io/ReadYourUsers/) | [Compare](https://study8677.github.io/ReadYourUsers/en/compare/index.html) | [Product page](https://study8677.github.io/ReadYourUsers/en/products/zed-industries-zed.html) | [Full report](reports/latest/zed-industries-zed.md) | [中文版](README.zh.md) | *Based on public GitHub issues — signal, not census.*

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
