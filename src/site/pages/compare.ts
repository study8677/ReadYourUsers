import type { CrossProductSummary, ProductSummaryCard } from "../../models/site.js";
import type { UiLang } from "../i18n.js";
import { ui } from "../i18n.js";
import {
  buildSignalCard,
  escapeHtml,
  formatDate,
  listOrFallback,
  pageTemplate,
  routeFor,
} from "../html.js";

export function formatCompareProductNames(uiLang: UiLang, products: ProductSummaryCard[]): string {
  const names = products.map((product) => product.displayName);

  if (names.length <= 1) {
    return names[0] ?? "";
  }

  if (uiLang === "zh") {
    return names.join("、");
  }

  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")}, and ${names.at(-1)}`;
}

export function compareIntroCopy(uiLang: UiLang, products: ProductSummaryCard[]): string {
  const names = formatCompareProductNames(uiLang, products);
  if (!names) {
    return ui[uiLang].compareEmptyCopy;
  }

  return uiLang === "zh"
    ? `看看${names}用户这周关注点在哪里重叠、又在哪里分化。`
    : `See where ${names} users overlap and diverge this week.`;
}

export function getVisibleProducts(
  summary: CrossProductSummary | null,
  latestEntries: { slug: string; routePath: string }[],
  uiLang: UiLang
): ProductSummaryCard[] {
  if (!summary) return [];

  const entryBySlug = new Map(
    latestEntries
      .filter((entry) => entry.routePath.startsWith(`${uiLang}/`))
      .map((entry) => [entry.slug, entry] as const)
  );

  return summary.products.flatMap((product) => {
    const latestEntry = entryBySlug.get(product.slug);
    return latestEntry ? [product] : [];
  });
}

export function buildComparePage(
  uiLang: UiLang,
  summary: CrossProductSummary | null,
  visibleProducts: ProductSummaryCard[]
): string {
  const t = ui[uiLang];
  const introCopy = compareIntroCopy(uiLang, visibleProducts);

  const productCards = visibleProducts
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
          <span>${t.productTopNeed}: ${escapeHtml(topNeed?.title ?? "—")}</span>
          <span>${t.productRisingNeed}: ${escapeHtml(risingNeed?.title ?? "—")}</span>
          <span>${t.productDominantCategory}: ${escapeHtml(product.dominantCategory ?? "—")}</span>
        </div>
      </article>`;
    })
    .join("\n");

  const visibleSlugs = new Set(visibleProducts.map((product) => product.slug));
  const signals = summary
    ? summary.hottestSignals
        .filter((signal) => visibleSlugs.has(signal.slug))
        .slice(0, 6)
        .map((signal) => buildSignalCard(signal, uiLang, `../products/${signal.slug}.html`))
        .join("\n")
    : "";

  const uniqueRows = visibleProducts
    .map(
      (product) =>
        `<li><strong>${escapeHtml(product.displayName)}</strong><span>${escapeHtml(
          listOrFallback(summary?.uniqueThemes[product.slug] ?? [], t.themeNone)
        )}</span></li>`
    )
    .join("");

  const body = summary && visibleProducts.length > 0
    ? `<section class="page-intro"><p class="eyebrow">${t.compareIntroEyebrow}</p><h1>${t.compareIntroTitle}</h1><p>${escapeHtml(introCopy)}</p></section>
      <section class="panel">
        <div class="panel-header"><h2>${t.compareProductsTitle}</h2></div>
        <section class="repo-grid">${productCards}</section>
      </section>
      <section class="panel">
        <div class="panel-header"><h2>${t.compareSignalsTitle}</h2></div>
        <div class="cluster-grid">${signals}</div>
      </section>
      <section class="section-grid">
        <section class="panel compact">
          <p class="eyebrow">${t.homeThemesEyebrow}</p>
          <h2>${t.compareSharedTitle}</h2>
          <p>${escapeHtml(listOrFallback(summary.sharedThemes, t.themeNone))}</p>
        </section>
        <section class="panel compact">
          <p class="eyebrow">${t.homeThemesEyebrow}</p>
          <h2>${t.compareUniqueTitle}</h2>
          <ul class="link-list">${uniqueRows}</ul>
        </section>
      </section>`
    : `<section class="page-intro"><p class="eyebrow">${t.compareIntroEyebrow}</p><h1>${t.compareIntroTitle}</h1><p>${t.compareEmptyCopy}</p></section>`;

  return pageTemplate({
    uiLang,
    title: `${t.navCompare} — ${t.siteName}`,
    description: summary && visibleProducts.length > 0 ? introCopy : t.compareEmptyCopy,
    body,
    depth: 2,
    routePath: routeFor(uiLang, "compare/index.html"),
    alternateRoutePath: routeFor(uiLang === "en" ? "zh" : "en", "compare/index.html"),
  });
}
