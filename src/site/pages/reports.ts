import { readFileSync } from "node:fs";
import type { UiLang } from "../i18n.js";
import { ui } from "../i18n.js";
import {
  escapeHtml,
  formatDate,
  markdownToHtml,
  pageTemplate,
  prefix,
  routeFor,
  type ReportLang,
  type SiteReportEntry,
} from "../html.js";

const COPY_BY_UI_LANG: Record<UiLang, ReportLang> = {
  en: "en",
  zh: "zh",
};

export function buildLatestIndex(uiLang: UiLang, entries: SiteReportEntry[]): string {
  const t = ui[uiLang];
  const cards = entries
    .filter((entry) => entry.reportLang === COPY_BY_UI_LANG[uiLang])
    .sort((a, b) => (b.aggregation?.generated_at ?? "").localeCompare(a.aggregation?.generated_at ?? ""))
    .map(
      (entry) => `<article class="repo-card">
      <div class="repo-card-head">
        <h2><a href="./${entry.slug}.html">${escapeHtml(entry.displayName)}</a></h2>
        <span>${formatDate(entry.aggregation?.generated_at)}</span>
      </div>
      <p>${entry.aggregation?.total_issues_analyzed ?? 0} ${t.repoCardIssues} · ${entry.aggregation?.clusters.length ?? 0} ${t.repoCardClusters}</p>
      <div class="report-links">
        <a href="../../${routeFor("en", `latest/${entry.slug}.html`)}">${t.reportEn}</a>
        <a href="../../${routeFor("zh", `latest/${entry.slug}.html`)}">${t.reportZh}</a>
        <a href="../../reports/latest/${entry.slug}${uiLang === "zh" ? ".zh" : ""}.md">${t.markdown}</a>
      </div>
    </article>`
    )
    .join("\n");

  return pageTemplate({
    uiLang,
    title: `${t.navLatest} — ${t.siteName}`,
    description: t.latestIntroTitle,
    body: `<section class="page-intro"><p class="eyebrow">${t.latestIntroEyebrow}</p><h1>${t.latestIntroTitle}</h1><p>${t.latestIntroCopy}</p></section><section class="repo-grid">${cards}</section>`,
    depth: 2,
    routePath: routeFor(uiLang, "latest/index.html"),
    alternateRoutePath: routeFor(uiLang === "en" ? "zh" : "en", "latest/index.html"),
  });
}

export function buildArchiveIndex(uiLang: UiLang, archiveWeeks: Map<string, SiteReportEntry[]>): string {
  const t = ui[uiLang];
  const weeks = Array.from(archiveWeeks.keys()).sort().reverse();
  const sections = weeks
    .map((week) => {
      const entries = (archiveWeeks.get(week) ?? []).filter((entry) => entry.reportLang === COPY_BY_UI_LANG[uiLang]);
      return `<section class="panel archive-panel" id="${week}">
      <div class="panel-header"><h2>${week}</h2><span>${entries.length} ${t.reportsCount}</span></div>
      <ul class="archive-list">
        ${entries
          .map(
            (entry) => `<li><a href="./${week}/${entry.slug}.html">${escapeHtml(entry.displayName)}</a><span><a href="../../${routeFor("en", `archive/${week}/${entry.slug}.html`)}">${t.reportEn}</a> · <a href="../../${routeFor("zh", `archive/${week}/${entry.slug}.html`)}">${t.reportZh}</a> · <a href="../../reports/archive/${week}/${entry.slug}${uiLang === "zh" ? ".zh" : ""}.md">${t.markdown}</a></span></li>`
          )
          .join("")}
      </ul>
    </section>`;
    })
    .join("\n");

  return pageTemplate({
    uiLang,
    title: `${t.navArchive} — ${t.siteName}`,
    description: t.archiveIntroTitle,
    body: `<section class="page-intro"><p class="eyebrow">${t.archiveIntroEyebrow}</p><h1>${t.archiveIntroTitle}</h1><p>${t.archiveIntroCopy}</p></section>${sections}`,
    depth: 2,
    routePath: routeFor(uiLang, "archive/index.html"),
    alternateRoutePath: routeFor(uiLang === "en" ? "zh" : "en", "archive/index.html"),
  });
}

export function buildReportPage(uiLang: UiLang, entry: SiteReportEntry): string {
  const t = ui[uiLang];
  const markdown = readFileSync(entry.sourcePath, "utf-8");
  const html = markdownToHtml(markdown);
  const reportLabel = entry.week ? `${entry.displayName} · ${entry.week}` : `${entry.displayName} · ${t.navLatest}`;
  const depth = entry.week ? 3 : 2;
  const base = prefix(depth);
  const rawHref = `${base}/${entry.rawRoutePath}`;
  const alternateRoutePath = entry.week
    ? routeFor(uiLang === "en" ? "zh" : "en", `archive/${entry.week}/${entry.slug}.html`)
    : routeFor(uiLang === "en" ? "zh" : "en", `latest/${entry.slug}.html`);
  const alternateHref = `${base}/${alternateRoutePath}`;
  const currentRoutePath = entry.week
    ? routeFor(uiLang, `archive/${entry.week}/${entry.slug}.html`)
    : routeFor(uiLang, `latest/${entry.slug}.html`);
  const printHref = entry.week ? "" : `${base}/${routeFor(uiLang, `print/${entry.slug}.html`)}`;
  const pdfLink = printHref ? `<a href="${printHref}" target="_blank">${t.downloadPdf}</a>` : "";
  const body = `<section class="page-intro narrow"><p class="eyebrow">${entry.week ? t.reportPageArchive : t.reportPageLatest}</p><h1>${escapeHtml(reportLabel)}</h1><div class="report-links">${pdfLink}<a href="${rawHref}">${t.rawMarkdown}</a><a href="${alternateHref}">${uiLang === "en" ? t.switchToChinese : t.switchToEnglish}</a></div></section><article class="markdown-body">${html}</article>`;

  return pageTemplate({
    uiLang,
    title: `${reportLabel} — ${t.siteName}`,
    description: `${entry.displayName} report`,
    body,
    depth,
    routePath: currentRoutePath,
    alternateRoutePath,
  });
}
