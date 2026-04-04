import type { ProductSummaryCard } from "../../models/site.js";
import type { UiLang } from "../i18n.js";
import { ui } from "../i18n.js";
import {
  escapeHtml,
  formatDate,
  formatRisingScore,
  pageTemplate,
  prefix,
  routeFor,
  topFiveRow,
} from "../html.js";

export function buildProductPage(uiLang: UiLang, product: ProductSummaryCard): string {
  const t = ui[uiLang];
  const base = prefix(2);
  const topClusters = [...product.aggregation.clusters].sort((a, b) => b.demand_score - a.demand_score).slice(0, 5);
  const topNeed = product.topNeed;
  const risingNeed = product.risingNeed;
  const body = `
    <section class="hero">
      <div>
        <p class="eyebrow">${t.productEyebrow}</p>
        <h1>${escapeHtml(product.displayName)}</h1>
        <p class="hero-copy">${escapeHtml(topNeed?.summary ?? "")}</p>
        <div class="report-links">
          <a href="${base}/${routeFor(uiLang, `print/product-${product.slug}.html`)}" target="_blank">${t.downloadPdf}</a>
          <a href="${base}/${routeFor("en", `latest/${product.slug}.html`)}">${t.reportEn}</a>
          <a href="${base}/${routeFor("zh", `latest/${product.slug}.html`)}">${t.reportZh}</a>
          <a href="${base}/${product.reportPaths[uiLang]}">${t.rawMarkdown}</a>
          <a href="${base}/${routeFor(uiLang, "compare/index.html")}">${t.productCompareView}</a>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><span>${t.statsIssues}</span><strong>${product.totalIssuesAnalyzed}</strong></div>
        <div class="stat-card"><span>${t.statsIncluded}</span><strong>${product.totalIssuesIncluded}</strong></div>
        <div class="stat-card"><span>${t.statsClusters}</span><strong>${product.totalClusters}</strong></div>
        <div class="stat-card"><span>${t.statsUpdated}</span><strong>${formatDate(product.generatedAt)}</strong></div>
      </div>
    </section>

    <section class="insight-grid">
      <article class="insight-card">
        <span class="insight-label">${t.productTopNeed}</span>
        <h3>${escapeHtml(topNeed?.title ?? "—")}</h3>
        <p>${topNeed ? `${topNeed.demand_score.toFixed(1)} ${t.topFiveScore}` : ""}</p>
      </article>
      <article class="insight-card">
        <span class="insight-label">${t.productRisingNeed}</span>
        <h3>${escapeHtml(risingNeed?.title ?? "—")}</h3>
        <p>${risingNeed ? formatRisingScore(risingNeed.rising_score) : ""}</p>
      </article>
      <article class="insight-card">
        <span class="insight-label">${t.productDominantCategory}</span>
        <h3>${escapeHtml(product.dominantCategory ?? "—")}</h3>
        <p>${escapeHtml(product.category)}</p>
      </article>
    </section>

    <section class="panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">${t.productNeedsEyebrow}</p>
          <h2>${t.productNeedsTitle}</h2>
        </div>
      </div>
      ${
        topClusters.length > 0
          ? `<ol class="top-five-list">${topClusters.map((cluster, index) => topFiveRow(cluster, index, uiLang)).join("\n")}</ol>`
          : `<p>${t.compareEmptyCopy}</p>`
      }
    </section>`;

  return pageTemplate({
    uiLang,
    title: `${product.displayName} — ${t.siteName}`,
    description: topNeed?.summary ?? product.displayName,
    body,
    depth: 2,
    routePath: routeFor(uiLang, `products/${product.slug}.html`),
    alternateRoutePath: routeFor(uiLang === "en" ? "zh" : "en", `products/${product.slug}.html`),
  });
}
