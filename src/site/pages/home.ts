import type { UiLang } from "../i18n.js";
import { ui } from "../i18n.js";
import {
  escapeHtml,
  formatDate,
  pageTemplate,
  routeFor,
  shortTitle,
  topFiveRow,
  type SiteReportEntry,
} from "../html.js";

const COPY_BY_UI_LANG: Record<UiLang, "en" | "zh"> = {
  en: "en",
  zh: "zh",
};

export function buildHomePage(uiLang: UiLang, defaultEntry: SiteReportEntry, latestEntries: SiteReportEntry[], archiveWeeks: Map<string, SiteReportEntry[]>): string {
  const t = ui[uiLang];
  const aggregation = defaultEntry.aggregation;
  if (!aggregation) throw new Error("Default homepage aggregation missing");

  const topClusters = [...aggregation.clusters].sort((a, b) => b.demand_score - a.demand_score).slice(0, 6);
  const topFive = topClusters.slice(0, 5);
  const risingClusters = [...aggregation.clusters].filter((c) => c.rising_score > 1).sort((a, b) => b.rising_score - a.rising_score).slice(0, 5);
  const topByVolume = [...aggregation.clusters].sort((a, b) => b.volume - a.volume).slice(0, 1);
  const recentWeeks = Array.from(archiveWeeks.keys()).sort().reverse().slice(0, 8);
  const otherRepos = latestEntries.filter((entry) => entry.slug !== defaultEntry.slug && entry.reportLang === COPY_BY_UI_LANG[uiLang]);
  const latestReportRoute = `${routeFor(uiLang, `latest/${defaultEntry.slug}.html`)}`;
  const latestMarkdownRoute = `reports/latest/${defaultEntry.slug}${uiLang === "zh" ? ".zh" : ""}.md`;
  const strongestDemand = topClusters[0];
  const biggestVolume = topByVolume[0] ?? topClusters[0];
  const fastestRising = risingClusters[0] ?? topClusters[0];
  const heroTitle = t.heroTitle
    .replace("{name}", escapeHtml(defaultEntry.displayName))
    .replace("{topDemand}", escapeHtml(shortTitle(strongestDemand.title)));
  const heroCopy = t.heroCopy
    .replaceAll("{topVolume}", `<strong>${escapeHtml(shortTitle(biggestVolume.title))}</strong>`)
    .replaceAll("{topDemand}", `<strong>${escapeHtml(shortTitle(strongestDemand.title))}</strong>`);

  const body = `
    <section class="hero">
      <div>
        <p class="eyebrow">${t.heroEyebrow}</p>
        <h1>${heroTitle}</h1>
        <p class="hero-copy">${heroCopy.replace("{name}", escapeHtml(defaultEntry.displayName))}</p>
        <div class="hero-actions">
          <a class="button primary" href="../${latestReportRoute}">${t.heroPrimary}</a>
          <a class="button" href="../${routeFor(uiLang, "archive/index.html")}">${t.heroSecondary}</a>
          <a class="button" href="../${latestMarkdownRoute}">${t.markdown}</a>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><span>${t.statsIssues}</span><strong>${aggregation.total_issues_analyzed}</strong></div>
        <div class="stat-card"><span>${t.statsIncluded}</span><strong>${aggregation.total_issues_included}</strong></div>
        <div class="stat-card"><span>${t.statsClusters}</span><strong>${aggregation.clusters.length}</strong></div>
        <div class="stat-card"><span>${t.statsUpdated}</span><strong>${formatDate(aggregation.generated_at)}</strong></div>
      </div>
    </section>

    <section class="panel insight-panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">${t.insightEyebrow}</p>
          <h2>${t.insightTitle}</h2>
        </div>
      </div>
      <div class="insight-grid">
        <article class="insight-card">
          <span class="insight-label">${t.insightTopDemand}</span>
          <h3>${escapeHtml(strongestDemand.title)}</h3>
          <p>${strongestDemand.demand_score.toFixed(1)} ${t.topFiveScore} · ${strongestDemand.volume} ${t.topFiveIssues} · ${escapeHtml(strongestDemand.category)}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">${t.insightTopVolume}</span>
          <h3>${escapeHtml(biggestVolume.title)}</h3>
          <p>${biggestVolume.volume} ${t.topFiveIssues} · ${biggestVolume.demand_score.toFixed(1)} ${t.topFiveScore} · ${escapeHtml(biggestVolume.category)}</p>
        </article>
        <article class="insight-card">
          <span class="insight-label">${t.insightTopRising}</span>
          <h3>${escapeHtml(fastestRising.title)}</h3>
          <p>${fastestRising.rising_score === Infinity ? "NEW" : `${fastestRising.rising_score.toFixed(1)}x`} · ${fastestRising.volume} ${t.topFiveIssues} · ${escapeHtml(fastestRising.category)}</p>
        </article>
      </div>
    </section>

    <section class="section-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">${t.snapshotEyebrow}</p>
            <h2>${t.topFiveTitle}</h2>
          </div>
          <div class="report-links">
            <a href="../${routeFor("en", `latest/${defaultEntry.slug}.html`)}">${t.reportEn}</a>
            <a href="../${routeFor("zh", `latest/${defaultEntry.slug}.html`)}">${t.reportZh}</a>
            <a href="../${latestMarkdownRoute}">${t.markdown}</a>
          </div>
        </div>
        <ol class="top-five-list">
          ${topFive.map((cluster, index) => topFiveRow(cluster, index, uiLang)).join("\n")}
        </ol>
      </section>

      <aside class="sidebar-stack">
        <section class="panel compact">
          <p class="eyebrow">${t.risingEyebrow}</p>
          <h2>${t.risingTitle}</h2>
          <ul class="link-list">
            ${risingClusters
              .map(
                (cluster) => `<li><strong>${escapeHtml(cluster.title)}</strong><span>${cluster.rising_score === Infinity ? "NEW" : `${cluster.rising_score.toFixed(1)}x`} · ${escapeHtml(cluster.category)}</span></li>`
              )
              .join("")}
          </ul>
        </section>

        <section class="panel compact">
          <p class="eyebrow">${t.otherEyebrow}</p>
          <h2>${t.otherTitle}</h2>
          <ul class="link-list">
            ${
              otherRepos.length > 0
                ? otherRepos
                    .map(
                      (entry) => `<li><a href="../${routeFor(uiLang, `latest/${entry.slug}.html`)}">${escapeHtml(entry.displayName)}</a><span>${formatDate(entry.aggregation?.generated_at)}</span></li>`
                    )
                    .join("")
                : `<li><span>${t.otherEmpty}</span></li>`
            }
          </ul>
        </section>

        <section class="panel compact">
          <p class="eyebrow">${t.historyEyebrow}</p>
          <h2>${t.historyTitle}</h2>
          <ul class="link-list">
            ${recentWeeks
              .map((week) => `<li><a href="../${routeFor(uiLang, `archive/index.html#${week}`)}">${week}</a><span>${archiveWeeks.get(week)?.length ?? 0} ${t.reportsCount}</span></li>`)
              .join("")}
          </ul>
        </section>
      </aside>
    </section>`;

  return pageTemplate({
    uiLang,
    title: t.siteName,
    description: heroTitle,
    body,
    depth: 1,
    routePath: routeFor(uiLang, "index.html"),
    alternateRoutePath: routeFor(uiLang === "en" ? "zh" : "en", "index.html"),
  });
}
