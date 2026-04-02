# ReadYourUsers

> Turn public GitHub issues into readable user demand maps.

ReadYourUsers analyzes public GitHub issues from AI coding tools and generates weekly demand reports — showing what developers actually want, ranked and clustered.

<!-- READYOURUSERS:START -->

## AI Coding Tools — What Developers Really Want

> Updated: 2026-04-02 | 99 issues analyzed | 17 need clusters identified

### Top 10 Needs

| Rank | Need | Issues | Score | Category | Examples |
| --- | --- | --- | --- | --- | --- |
| 1 | Session Customization and UI Stability Enhancements | 17 | 7.7 | UI/UX | [#42617](https://github.com/anthropics/claude-code/issues/42617), [#42613](https://github.com/anthropics/claude-code/issues/42613), [#42612](https://github.com/anthropics/claude-code/issues/42612) |
| 2 | Session Management and Resource Optimization | 19 | 4.8 | Reliability | [#42626](https://github.com/anthropics/claude-code/issues/42626), [#42624](https://github.com/anthropics/claude-code/issues/42624), [#42621](https://github.com/anthropics/claude-code/issues/42621) |
| 3 | Improving Editor Workflow and Stability | 9 | 4.0 | Developer Experience | [#42630](https://github.com/anthropics/claude-code/issues/42630), [#42622](https://github.com/anthropics/claude-code/issues/42622), [#42606](https://github.com/anthropics/claude-code/issues/42606) |
| 4 | Fix Platform-Specific and Functional Errors | 9 | 3.3 | Reliability | [#42631](https://github.com/anthropics/claude-code/issues/42631), [#42614](https://github.com/anthropics/claude-code/issues/42614), [#42593](https://github.com/anthropics/claude-code/issues/42593) |
| 5 | Resolve Critical Runtime and Session Issues | 3 | 3.0 | Reliability | [#42620](https://github.com/anthropics/claude-code/issues/42620), [#42615](https://github.com/anthropics/claude-code/issues/42615), [#42609](https://github.com/anthropics/claude-code/issues/42609) |
| 6 | Improved Model Accuracy and Data Handling | 5 | 3.0 | Developer Experience | [#42633](https://github.com/anthropics/claude-code/issues/42633), [#42629](https://github.com/anthropics/claude-code/issues/42629), [#42618](https://github.com/anthropics/claude-code/issues/42618) |
| 7 | Configurable Session Management and Notifications | 4 | 2.5 | Configuration | [#42625](https://github.com/anthropics/claude-code/issues/42625), [#42590](https://github.com/anthropics/claude-code/issues/42590), [#42542](https://github.com/anthropics/claude-code/issues/42542) |
| 8 | Authentication and Subscription Plan Enhancements | 5 | 2.3 | Configuration | [#42628](https://github.com/anthropics/claude-code/issues/42628), [#42605](https://github.com/anthropics/claude-code/issues/42605), [#42603](https://github.com/anthropics/claude-code/issues/42603) |
| 9 | Resolve Inconsistencies in Cowork Feature and Plugin Data | 2 | 2.0 | Reliability | [#42601](https://github.com/anthropics/claude-code/issues/42601), [#42578](https://github.com/anthropics/claude-code/issues/42578) |
| 10 | Enhance Agent Reliability and MCP Integration | 6 | 2.0 | Reliability | [#42632](https://github.com/anthropics/claude-code/issues/42632), [#42627](https://github.com/anthropics/claude-code/issues/42627), [#42599](https://github.com/anthropics/claude-code/issues/42599) |

### Rising Needs

| Need | Rising Score | This Week | Category |
| --- | --- | --- | --- |
| Session Management and Resource Optimization | 20.0x | 19 | Reliability |
| Session Customization and UI Stability Enhancements | 18.0x | 17 | UI/UX |
| Improving Editor Workflow and Stability | 10.0x | 9 | Developer Experience |
| Fix Platform-Specific and Functional Errors | 10.0x | 9 | Reliability |
| Enhance Agent Reliability and MCP Integration | 7.0x | 6 | Reliability |

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
