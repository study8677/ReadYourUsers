import type { CrossProductSummary, ProductSummaryCard } from "../../models/site.js";
import type { UiLang } from "../i18n.js";
import { ui } from "../i18n.js";
import {
  buildSignalCard,
  escapeHtml,
  formatDate,
  formatRisingScore,
  listOrFallback,
  pageTemplate,
  routeFor,
  shortTitle,
  type SiteReportEntry,
} from "../html.js";

export function buildObservatoryHomePage(
  uiLang: UiLang,
  summary: CrossProductSummary,
  visibleProducts: ProductSummaryCard[],
  archiveWeeks: Map<string, SiteReportEntry[]>
): string {
  const t = ui[uiLang];
  const visibleSlugs = new Set(visibleProducts.map((product) => product.slug));
  const hottestSignals = summary.hottestSignals.filter((signal) => visibleSlugs.has(signal.slug)).slice(0, 6);
  const leadSignal = hottestSignals[0];
  const fallbackLeadNeed = visibleProducts[0]?.topNeed;
  const recentWeeks = Array.from(archiveWeeks.keys()).sort().reverse().slice(0, 8);
  const heroCopy = t.homeObservatoryCopy.replace("{count}", String(visibleProducts.length));
  const featuredProducts = visibleProducts.slice(0, 6);

  const productCards = featuredProducts
    .map((product) => {
      const topNeed = product.topNeed;
      const risingNeed = product.risingNeed;

      return `<article class="repo-card">
        <div class="repo-card-head">
          <h2><a href="./products/${product.slug}.html">${escapeHtml(product.displayName)}</a></h2>
          <span>${formatDate(product.generatedAt)}</span>
        </div>
        <p>${escapeHtml(topNeed?.summary ?? "")}</p>
        <div class="top-five-meta">
          <span>${product.totalIssuesAnalyzed} ${t.repoCardIssues}</span>
          <span>${product.totalClusters} ${t.repoCardClusters}</span>
          <span>${escapeHtml(product.dominantCategory ?? "—")}</span>
        </div>
        <div class="report-links">
          <a href="./products/${product.slug}.html">${t.homeProductViewDetail}</a>
          <a href="./latest/${product.slug}.html">${t.productLatestReport}</a>
          ${
            risingNeed
              ? `<span>${t.productRisingNeed}: ${escapeHtml(shortTitle(risingNeed.title, 42))} (${formatRisingScore(risingNeed.rising_score)})</span>`
              : ""
          }
        </div>
      </article>`;
    })
    .join("\n");

  const signals = hottestSignals.length > 0
    ? hottestSignals
        .map((signal) => buildSignalCard(signal, uiLang, `./products/${signal.slug}.html`))
        .join("\n")
    : `<article class="repo-card"><p>${t.compareEmptyCopy}</p></article>`;

  const uniqueThemeRows = visibleProducts
    .map(
      (product) =>
        `<li><strong>${escapeHtml(product.displayName)}</strong><span>${escapeHtml(
          listOrFallback(summary.uniqueThemes[product.slug] ?? [], t.themeNone)
        )}</span></li>`
    )
    .join("");

  const body = `
    <section class="hero">
      <div>
        <p class="eyebrow">${t.homeObservatoryEyebrow}</p>
        <h1>${t.homeObservatoryTitle}</h1>
        <p class="hero-copy">${heroCopy}</p>
        <div class="hero-actions">
          <a class="button primary" href="./compare/index.html">${t.homeComparePrimary}</a>
          <a class="button" href="./latest/index.html">${t.homeLatestSecondary}</a>
          <a class="button" href="./tools/index.html">${t.homeToolsTertiary}</a>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><span>${t.homeStatsProducts}</span><strong>${visibleProducts.length}</strong></div>
        <div class="stat-card"><span>${t.homeStatsSignals}</span><strong>${hottestSignals.length}</strong></div>
        <div class="stat-card"><span>${t.homeStatsSharedThemes}</span><strong>${summary.sharedThemes.length}</strong></div>
        <div class="stat-card"><span>${t.statsUpdated}</span><strong>${formatDate(summary.generatedAt)}</strong></div>
      </div>
    </section>

    <section class="panel insight-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">${t.homeSignalsEyebrow}</p>
          <h2>${t.homeSignalsTitle}</h2>
        </div>
      </div>
      <div class="insight-grid">
        <article class="insight-card">
          <span class="insight-label">${t.insightTopDemand}</span>
          <h3>${escapeHtml(leadSignal?.title ?? fallbackLeadNeed?.title ?? "—")}</h3>
          <p>${
            leadSignal
              ? `${leadSignal.demandScore.toFixed(1)} ${t.topFiveScore}`
              : fallbackLeadNeed
                ? `${fallbackLeadNeed.demand_score.toFixed(1)} ${t.topFiveScore}`
                : t.compareEmptyCopy
          }</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">${t.compareSharedTitle}</span>
          <h3>${summary.sharedThemes.length}</h3>
          <p>${escapeHtml(listOrFallback(summary.sharedThemes, t.themeNone))}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">${t.compareProductsTitle}</span>
          <h3>${visibleProducts[0]?.displayName ?? "—"}</h3>
          <p>${escapeHtml(visibleProducts[0]?.topNeed?.title ?? t.compareEmptyCopy)}</p>
        </article>
      </div>
    </section>

    <section class="section-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">${t.homeProductsEyebrow}</p>
            <h2>${t.homeProductsTitle}</h2>
          </div>
          <a href="./tools/index.html">${t.homeProductsViewAll}</a>
        </div>
        <section class="repo-grid">
          ${productCards}
        </section>
      </section>

      <aside class="sidebar-stack">
        <section class="panel compact">
          <p class="eyebrow">${t.homeThemesEyebrow}</p>
          <h2>${t.homeThemesTitle}</h2>
          <ul class="link-list">
            <li><strong>${t.compareSharedTitle}</strong><span>${escapeHtml(listOrFallback(summary.sharedThemes, t.themeNone))}</span></li>
            ${uniqueThemeRows}
          </ul>
        </section>

        <section class="panel compact">
          <p class="eyebrow">${t.historyEyebrow}</p>
          <h2>${t.historyTitle}</h2>
          <ul class="link-list">
            ${recentWeeks
              .map((week) => `<li><a href="./archive/index.html#${week}">${week}</a><span>${archiveWeeks.get(week)?.length ?? 0} ${t.reportsCount}</span></li>`)
              .join("")}
          </ul>
        </section>
      </aside>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">${t.compareIntroEyebrow}</p>
          <h2>${t.compareSignalsTitle}</h2>
        </div>
      </div>
      <div class="cluster-grid">
        ${signals}
      </div>
    </section>`;

  return pageTemplate({
    uiLang,
    title: t.siteName,
    description: t.homeObservatoryTitle,
    body,
    depth: 1,
    routePath: routeFor(uiLang, "index.html"),
    alternateRoutePath: routeFor(uiLang === "en" ? "zh" : "en", "index.html"),
  });
}
