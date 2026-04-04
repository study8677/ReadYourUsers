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
  shortTitle,
} from "../html.js";

export function buildToolsPage(uiLang: UiLang, visibleProducts: ProductSummaryCard[]): string {
  const t = ui[uiLang];
  const base = prefix(2);
  const risingValue = (product: ProductSummaryCard): number =>
    product.risingNeed?.rising_score === Infinity
      ? 999
      : (product.risingNeed?.rising_score ?? -1);
  const overallValue = (product: ProductSummaryCard): number =>
    (product.topNeed?.demand_score ?? 0) +
    Math.min(risingValue(product), 20) * 0.35 +
    Math.log10(product.totalIssuesIncluded + 1);
  const sortByText = (left: ProductSummaryCard, right: ProductSummaryCard): number =>
    left.displayName.localeCompare(right.displayName, "en");
  const byOverall = [...visibleProducts]
    .sort(
      (left, right) =>
        overallValue(right) - overallValue(left) ||
        (right.topNeed?.demand_score ?? 0) - (left.topNeed?.demand_score ?? 0) ||
        right.totalIssuesIncluded - left.totalIssuesIncluded ||
        sortByText(left, right)
    )
    .slice(0, 5);
  const byRising = [...visibleProducts]
    .filter((product) => product.risingNeed)
    .sort(
      (left, right) =>
        risingValue(right) - risingValue(left) ||
        (right.topNeed?.demand_score ?? 0) - (left.topNeed?.demand_score ?? 0) ||
        sortByText(left, right)
    )
    .slice(0, 5);
  const byDiscussed = [...visibleProducts]
    .sort(
      (left, right) =>
        right.totalIssuesIncluded - left.totalIssuesIncluded ||
        (right.topNeed?.volume ?? 0) - (left.topNeed?.volume ?? 0) ||
        sortByText(left, right)
    )
    .slice(0, 5);

  const leaderboard = (
    title: string,
    products: ProductSummaryCard[],
    metric: (product: ProductSummaryCard) => string
  ) =>
    `<section class="panel compact">
      <div class="panel-header"><h2>${title}</h2></div>
      <ol class="link-list">
        ${products
          .map(
            (product) =>
              `<li><strong><a href="../products/${product.slug}.html">${escapeHtml(product.displayName)}</a></strong><span>${metric(product)}</span></li>`
          )
          .join("")}
      </ol>
    </section>`;

  const cards = visibleProducts
    .map((product) => {
      const topNeed = product.topNeed;
      const risingNeed = product.risingNeed;

      return `<article class="repo-card">
        <div class="repo-card-head">
          <h2><a href="../products/${product.slug}.html">${escapeHtml(product.displayName)}</a></h2>
          <span>${formatDate(product.generatedAt)}</span>
        </div>
        <p>${escapeHtml(topNeed?.summary ?? "")}</p>
        <div class="top-five-meta">
          <span>${product.totalIssuesAnalyzed} ${t.repoCardIssues}</span>
          <span>${product.totalClusters} ${t.repoCardClusters}</span>
          <span>${escapeHtml(product.dominantCategory ?? "—")}</span>
        </div>
        <div class="report-links">
          <a href="../products/${product.slug}.html">${t.toolsViewProduct}</a>
          <a href="${base}/${routeFor(uiLang, `latest/${product.slug}.html`)}">${t.productLatestReport}</a>
          ${
            risingNeed
              ? `<span>${t.productRisingNeed}: ${escapeHtml(shortTitle(risingNeed.title, 42))} (${formatRisingScore(risingNeed.rising_score)})</span>`
              : ""
          }
        </div>
      </article>`;
    })
    .join("\n");

  const body = `<section class="page-intro"><p class="eyebrow">${t.toolsIntroEyebrow}</p><h1>${t.toolsIntroTitle}</h1><p>${t.toolsIntroCopy}</p></section>
    <section class="section-grid">
      ${leaderboard(
        t.toolsOverallTitle,
        byOverall,
        (product) =>
          `${t.toolsMetricDemand} ${(product.topNeed?.demand_score ?? 0).toFixed(1)} · ${t.toolsMetricRising} ${product.risingNeed ? formatRisingScore(product.risingNeed.rising_score) : "—"}`
      )}
      ${leaderboard(
        t.toolsRisingTitle,
        byRising,
        (product) =>
          `${t.toolsMetricRising} ${product.risingNeed ? formatRisingScore(product.risingNeed.rising_score) : "—"} · ${t.toolsMetricDemand} ${(product.topNeed?.demand_score ?? 0).toFixed(1)}`
      )}
      ${leaderboard(
        t.toolsDiscussedTitle,
        byDiscussed,
        (product) =>
          `${t.toolsMetricVolume} ${product.totalIssuesIncluded} · ${t.toolsMetricDemand} ${(product.topNeed?.demand_score ?? 0).toFixed(1)}`
      )}
    </section>
    <section class="panel">
      <div class="panel-header"><h2>${t.toolsAllTitle}</h2></div>
      <section class="repo-grid">${cards}</section>
    </section>`;

  return pageTemplate({
    uiLang,
    title: `${t.navTools} — ${t.siteName}`,
    description: t.toolsIntroCopy,
    body,
    depth: 2,
    routePath: routeFor(uiLang, "tools/index.html"),
    alternateRoutePath: routeFor(uiLang === "en" ? "zh" : "en", "tools/index.html"),
  });
}
