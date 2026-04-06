# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

ReadYourUsers is a TypeScript CLI that fetches public GitHub issues from 16 AI coding products, uses LLMs to extract structured demand signals, clusters them, and publishes bilingual (en/zh) reports and a static HTML observatory site.

## Commands

```bash
npm run build            # tsc: src/ → dist/
npm run dev              # Run CLI via tsx (no build needed)
npm run site:build       # Generate static HTML site
npm test                 # vitest run (single pass)
npm run test:watch       # vitest in watch mode
npx vitest run tests/llm/client.test.ts   # Run a single test file
```

CLI (installed as `ryu`, or use `npx tsx src/cli.ts` during dev):
```bash
ryu fetch [repo]         # Fetch issues from GitHub API
ryu analyze [repo]       # LLM-analyze fetched issues
ryu aggregate [repo]     # Cluster and score
ryu generate [repo]      # Produce reports + site data
ryu run [repo]           # Full pipeline (all four stages)
  --since-days <n>       # Analysis window (default 30)
  --llm-themes           # Use LLM for cross-product theme matching

# fetch/analyze/aggregate all accept:
  --parallel <n>         # Repos to process concurrently (default 1)

# aggregate also accepts:
  --llm-merge            # Use LLM to merge semantically similar clusters
```

## Architecture

### Four-Stage Pipeline

```
FETCH → ANALYZE → AGGREGATE → GENERATE
```

Each stage reads the previous stage's output from disk. Stages can be run independently (e.g., re-analyze without re-fetching). The `run` command orchestrates all four.

- **Fetch** (`pipeline/fetcher.ts`): Octokit with throttling, ETag-based HTTP caching, incremental updates.
- **Analyze** (`pipeline/analyzer.ts`): Sends each issue to an LLM, extracts structured fields (type, normalized_need, module_tags, severity, confidence) validated by Zod schemas (`schemas/analysis.ts`). Skips already-analyzed issues. Runs LLM calls in parallel via `mapWithConcurrency` (default 5).
- **Aggregate** (`pipeline/aggregator.ts`): Groups by module_tags, then sub-clusters within each group by text similarity (`utils/similarity.ts`, threshold in `config/constants.ts`). Optional `--llm-merge` pass uses `ClusterMergeSchema` to merge borderline-similar clusters via LLM. Demand scores use global engagement normalization for fair cross-cluster comparison. Cluster IDs are deterministic (SHA256 of sorted needs).
- **Generate** (`pipeline/generator.ts` + `pipeline/readme-templates.ts`): Produces Markdown reports (en + zh), cross-product JSON (`pipeline/cross-product.ts`), and updates README snapshots. Optional `--llm-themes` uses LLM to semantically match shared themes across products. Site is rendered by `site/build.ts` (orchestrator) with page builders in `site/pages/` (`home`, `product`, `compare`, `observatory`, `reports`, `tools`, `print`), i18n in `site/i18n.ts`, HTML utilities in `site/html.ts`.

### Data Directory Layout

```
data/raw/{owner-repo}/issues.json       # Cached GitHub API responses
data/raw/{owner-repo}/meta.json         # ETag + fetch metadata
data/analyzed/{owner-repo}/analyses.json # LLM analysis results (incremental)
data/aggregated/{owner-repo}/clusters.json
reports/latest/{repo}.md                 # English report
reports/latest/{repo}.zh.md              # Chinese report
reports/latest/cross-product.json
site/{en,zh}/{index.html, compare/, products/}
```

`data/raw/` and `data/analyzed/` are gitignored (regenerable). `data/aggregated/` and `reports/` are committed.

### Dual LLM Provider

`llm/client.ts` supports two paths:
- **Anthropic**: Direct SDK, uses Haiku for analysis and Sonnet for aggregation.
- **OpenAI-compatible**: Works with OpenRouter, Teamo Router, or any compatible endpoint. Includes retry logic with configurable fallback models. Provider-specific behavior (OpenRouter headers, Teamo reasoning disable) is auto-detected from the base URL.

Models are selected in `config/constants.ts` and overridable via `ANALYSIS_MODEL` / `AGGREGATION_MODEL` env vars. Use `resetClients()` (exported from `llm/client.ts`) to reset cached client instances in tests.

### Scoring

- **Demand score** = volume × recency (62-day half-life exponential decay) × engagement × cross-repo weight
- **Rising score** = (this_week + 1) / (prev_week + 1) — Laplace-smoothed week-over-week ratio

Implemented in `scoring/demand.ts` and `scoring/rising.ts`.

## Key Configuration

Environment variables (see `.env.example`):
- `READYOURUSERS_GITHUB_TOKEN` — GitHub PAT (required; also reads `GITHUB_TOKEN`)
- `LLM_PROVIDER` — `"anthropic"` or `"openai"`
- `OPENAI_API_KEY`, `OPENAI_BASE_URL` — for OpenAI-compatible providers
- `ANALYSIS_MODEL`, `AGGREGATION_MODEL` — model overrides
- `OPENAI_FALLBACK_MODELS` — comma-separated fallback list for retries

Tracked products are defined in `config/repos.json` (Zod-validated via `config/repos.ts`).

## Module System

ESM throughout: `"type": "module"` in package.json, `"module": "Node16"` in tsconfig. All imports use explicit `.js` extensions in compiled output. TypeScript strict mode is enabled.

## Deployment

GitHub Actions (`.github/workflows/weekly-report.yml`) runs every Monday 09:00 UTC: fetches, analyzes, aggregates, generates reports, builds site, commits reports to git, deploys `site/` to GitHub Pages.
