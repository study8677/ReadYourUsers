# ReadYourUsers

> Turn public GitHub issues into readable user demand maps.

ReadYourUsers analyzes public GitHub issues from AI coding tools and generates weekly demand reports — showing what developers actually want, ranked and clustered.

<!-- READYOURUSERS:START -->

## AI Coding Tools — What Developers Really Want

> Updated: 2026-04-02 | 97 issues analyzed | 16 need clusters identified

### Top 10 Needs

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Improve Session Management and Input Reliability | 15 | 6.7 | UI/UX | [#42617](https://github.com/anthropics/claude-code/issues/42617), [#42613](https://github.com/anthropics/claude-code/issues/42613), [#42612](https://github.com/anthropics/claude-code/issues/42612) |
| 2 | Improved Session Stability and Token Management | 18 | 4.2 | Reliability | [#42637](https://github.com/anthropics/claude-code/issues/42637), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42615](https://github.com/anthropics/claude-code/issues/42615) |
| 3 | Enhancing MCP Server Connectivity and Diagnostics | 6 | 4.0 | Reliability | [#42632](https://github.com/anthropics/claude-code/issues/42632), [#42627](https://github.com/anthropics/claude-code/issues/42627), [#42599](https://github.com/anthropics/claude-code/issues/42599) |
| 4 | Optimize Performance and Resource Usage | 4 | 3.0 | Performance | [#42633](https://github.com/anthropics/claude-code/issues/42633), [#42620](https://github.com/anthropics/claude-code/issues/42620), [#42609](https://github.com/anthropics/claude-code/issues/42609) |
| 5 | Enhancements for Editor Functionality and UI Navigation | 10 | 3.0 | Developer Experience | [#42638](https://github.com/anthropics/claude-code/issues/42638), [#42631](https://github.com/anthropics/claude-code/issues/42631), [#42630](https://github.com/anthropics/claude-code/issues/42630) |
| 6 | Fix Issues with Tools, Configurations, and Platform Handling | 8 | 3.0 | Developer Experience | [#42635](https://github.com/anthropics/claude-code/issues/42635), [#42614](https://github.com/anthropics/claude-code/issues/42614), [#42611](https://github.com/anthropics/claude-code/issues/42611) |
| 7 | Enhance Conversation History Configurability and Handling | 4 | 3.0 | Configuration | [#42625](https://github.com/anthropics/claude-code/issues/42625), [#42590](https://github.com/anthropics/claude-code/issues/42590), [#42558](https://github.com/anthropics/claude-code/issues/42558) |
| 8 | Fix Session Stability and Functional Issues | 3 | 3.0 | Reliability | [#42591](https://github.com/anthropics/claude-code/issues/42591), [#42578](https://github.com/anthropics/claude-code/issues/42578), [#42557](https://github.com/anthropics/claude-code/issues/42557) |
| 9 | Subscription Plans and Token Management Enhancements | 5 | 2.7 | Configuration | [#42628](https://github.com/anthropics/claude-code/issues/42628), [#42626](https://github.com/anthropics/claude-code/issues/42626), [#42605](https://github.com/anthropics/claude-code/issues/42605) |
| 10 | Enhance Model Accuracy and Output Consistency | 6 | 2.2 | Developer Experience | [#42636](https://github.com/anthropics/claude-code/issues/42636), [#42634](https://github.com/anthropics/claude-code/issues/42634), [#42629](https://github.com/anthropics/claude-code/issues/42629) |

### Rising Needs

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| Improved Session Stability and Token Management | 19.0x | 18 | Reliability |
| Improve Session Management and Input Reliability | 16.0x | 15 | UI/UX |
| Enhancements for Editor Functionality and UI Navigation | 11.0x | 10 | Developer Experience |
| Fix Issues with Tools, Configurations, and Platform Handling | 9.0x | 8 | Developer Experience |
| Enhancing MCP Server Connectivity and Diagnostics | 7.0x | 6 | Reliability |

*Based on public GitHub issues. [View full report](reports/latest/) | [Methodology](site/methods.md)*

<!-- READYOURUSERS:END -->

## How It Works

1. **Fetch** — Pull public issues from target repositories via GitHub API
2. **Analyze** — LLM extracts structured need signals from each issue
3. **Aggregate** — Cluster similar needs, compute demand & rising scores
4. **Generate** — Produce ranked reports with links back to original issues

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your API keys

# Run the full pipeline
npx tsx src/cli.ts run anthropics/claude-code
```

## Data Sources

| Repository | Product | Notes |
| --- | --- | --- |
| anthropics/claude-code | Claude Code | Anthropic's AI coding CLI |
| openai/codex | OpenAI Codex CLI | OpenAI's coding agent |
| getcursor/cursor | Cursor | AI code editor (GitHub is not primary feedback channel) |

## Principles

- **Public data only** — We only analyze public GitHub issues
- **Traceable conclusions** — Every insight links back to original issues
- **Signal, not census** — This represents public issue discussions, not all users
- **No contact scraping** — We never collect or use personal contact information

## License

MIT
