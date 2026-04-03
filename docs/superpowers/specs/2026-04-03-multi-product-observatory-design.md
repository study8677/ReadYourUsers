# ReadYourUsers multi-product observatory design

Date: 2026-04-03
Status: Approved in chat, pending user review of written spec

## Summary

Upgrade ReadYourUsers from a single-report static output into a unified public-facing observatory for AI coding products. The first tracked set is Claude Code, Codex, and Cursor. The site should feel like one coherent product: a compelling homepage for discovery, a comparison surface for cross-product reading, consistent product pages, and report/archive pages as the evidence layer.

The project should also support OpenRouter via the existing OpenAI-compatible path, with `qwen/qwen3.6-plus:free` as the initial configured model target.

## Goals

- Turn the public site into something attractive enough to earn attention and GitHub stars.
- Present weekly cross-product signals instead of only per-repo reports.
- Keep all claims traceable back to public GitHub issues.
- Maintain bilingual English and Chinese main experiences.
- Preserve the existing fetch -> analyze -> aggregate -> generate pipeline where possible.

## Non-goals for v1

- Real-time updates or a backend service.
- Heavy interactive visualization libraries.
- User-defined filtering or custom compare builders.
- Multi-turn reasoning continuation using `reasoning_details`.
- Broad expansion beyond the initial three tracked products.

## Audience and positioning

Primary audience: external readers discovering the project publicly.

Positioning:

> A public observatory that tracks what users of major AI coding products are asking for right now, using public GitHub issues.

The site should read less like a utility homepage and more like a modern research/publication surface with strong data backing.

## UX and information architecture

### Site narrative

Reading flow should be:

1. global snapshot
2. product differences
3. single-product detail
4. evidence and archives

### Primary routes

- `/en/index.html`, `/zh/index.html` — homepage
- `/en/compare/index.html`, `/zh/compare/index.html` — cross-product comparison
- `/en/products/<slug>.html`, `/zh/products/<slug>.html` — product pages
- `/en/latest/...`, `/zh/latest/...` — latest generated report views
- `/en/archive/...`, `/zh/archive/...` — archive views
- raw markdown report paths remain available as evidence/deep-read entry points

### Homepage structure

1. Hero
   - strong title and subheading
   - product count, issue count, update time
   - GitHub star CTA + compare CTA
2. This week’s hottest demand map
   - 6-10 ranked signal cards aggregated across tracked products
   - each card includes need title, strongest product, count/signal, category, destination link
3. Products at a glance
   - three product summary cards
   - each card: top need, rising need, dominant category, issue count
4. Divergence/comparison block
   - shared pain vs unique pain across products
   - short, screenshot-friendly takeaways
5. Rising signals block
   - fastest-moving themes this week
6. Trust / methodology block
   - public GitHub sources
   - structured clustering and scoring
   - traceability and archive access

### Product page structure

All product pages should share the same layout:

1. product header
2. this week at a glance
3. top needs table/cards
4. rising signals
5. category breakdown
6. what changed this week
7. evidence + archive links

### Compare page structure

1. top need by product
2. shared vs unique themes
3. category comparison
4. rising comparison
5. short reader-facing takeaways

## Visual direction

The site should be unified, editorial, and data-forward rather than admin-dashboard-like.

Design characteristics:

- strong hierarchy on first screen
- high-contrast but restrained palette
- publication/research feel with dashboard clarity
- modular reusable card system
- clear bilingual parity

The homepage should feel compelling first, analytical second, but the evidence layer must remain one click away.

## Data model and generation design

### Existing pipeline reuse

Retain the current core stages:

- fetch
- analyze
- aggregate
- generate

The upgrade should mostly add a cross-product summary layer and richer page generation.

### New cross-product summary artifact

Add a generated cross-product summary artifact for homepage and compare pages, for example:

- `reports/latest/cross-product.json`

It should summarize all products that currently have usable generated outputs.

Suggested fields:

- tracked products available
- per-product issue totals
- per-product top needs
- per-product rising needs
- category counts/breakdown
- global hottest signals
- shared themes
- unique themes
- update timestamp
- links to reports/product pages

### Product availability behavior

The site must degrade gracefully.

- If Claude Code and Codex are available but Cursor is not, homepage and compare page still render.
- Product sections should only include products with valid generated artifacts.
- The architecture must support adding more products later without rewriting templates.

### Global signal derivation

Homepage signal cards should be derived from per-product cluster outputs using rule-based aggregation in v1:

- demand score
- rising score
- issue count
- category
- product attribution

This avoids making the whole site depend on another model call.

### Cross-product narrative generation

Preferred v1 behavior:

- Use deterministic aggregation for core metrics and ranking.
- Optionally generate a short cross-product narrative via one extra model call.
- The narrative layer must be optional/failable without breaking page generation.

This creates a graceful degradation path:

- data pages always build
- stronger narrative appears when model generation succeeds

## LLM/provider design

### Provider path

Use the existing OpenAI-compatible path for OpenRouter.

Environment shape:

- `LLM_PROVIDER=openai`
- `OPENAI_API_KEY=<openrouter key>`
- `OPENAI_BASE_URL=https://openrouter.ai/api/v1`
- `ANALYSIS_MODEL=qwen/qwen3.6-plus:free`
- `AGGREGATION_MODEL=qwen/qwen3.6-plus:free`

### Scope of provider changes

v1 provider work should cover:

- explicit documentation for OpenRouter usage
- compatibility checks for model/base URL config
- keeping structured JSON output behavior working through the OpenAI-compatible client path
- optional provider-specific headers only if necessary

### Reasoning support decision

Do not implement `reasoning_details` continuation in v1.

Reason:

- the project is batch-oriented, not chat-session-oriented
- most work is single-pass structured extraction and summarization
- added complexity is not necessary to ship the multi-product observatory

## Implementation phases

### Phase 1: provider and data readiness

- make OpenRouter + Qwen configuration explicit and usable
- verify Codex runs through the full pipeline
- verify Cursor runs or degrades gracefully
- produce cross-product summary artifact

### Phase 2: page generation upgrade

- redesign homepage
- add compare page
- add product pages
- keep latest/archive/report paths working

### Phase 3: narrative and polish

- improve hero copy
- add short takeaways
- add GitHub star CTA
- polish bilingual parity and layout hierarchy

### Phase 4: verification and fallback checks

- verify site builds when some products are missing
- verify English and Chinese routes exist
- verify report links and source traceability
- verify old routes still resolve where intended

## Success criteria

- Homepage clearly reads as a multi-product AI coding demand observatory.
- Codex is included in the generated public experience.
- The site has a dedicated compare surface.
- Product pages share a unified structure.
- English and Chinese main routes both feel first-class.
- The site remains functional even when one configured product lacks data.
- The design increases public-facing clarity and star-worthiness relative to the current single-report presentation.

## Risks and mitigations

### Risk: Cursor data may be noisy or incomplete
Mitigation: build templates around available products only and degrade gracefully.

### Risk: Cross-product narrative can be flaky
Mitigation: make narrative optional; rely on deterministic summary data for page generation.

### Risk: Homepage becomes too dense
Mitigation: enforce top-level narrative hierarchy and keep detail in product/report pages.

### Risk: Provider differences break structured output
Mitigation: keep OpenAI-compatible path minimal, verify JSON parsing against OpenRouter/Qwen outputs, and preserve a clean failure mode.

## Testing strategy

- unit/regression checks for cross-product summary generation
- site build verification for bilingual routes and new pages
- smoke run for at least Claude Code and Codex end-to-end
- fallback verification when one configured product has no generated report

## Open questions resolved in this spec

- Site direction: unified multi-product observatory
- Initial product set: Claude Code, Codex, Cursor
- Audience: public readers
- Goal: attention + stars
- Homepage emphasis: weekly hottest demand map first
- Language strategy: English and Chinese both strong
- Tone: homepage stronger/reader-friendly, lower layers more objective
- Provider direction: OpenRouter using `qwen/qwen3.6-plus:free`

## Out-of-scope enhancements for later

- historical trend charts across many weeks
- richer taxonomy/filters
- product ranking leaderboards beyond current need maps
- additional tracked products beyond the first three
- interactive drill-down visualization components
