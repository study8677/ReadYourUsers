import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { basename, extname, resolve } from "node:path";
import { loadRepoConfigs, repoSlug, type RepoConfig } from "../config/repos.js";
import type { NeedCluster, RepoAggregation } from "../models/cluster.js";

type ReportLang = "en" | "zh";
type UiLang = "en" | "zh";

interface SiteReportEntry {
  repo: string;
  slug: string;
  displayName: string;
  week?: string;
  reportLang: ReportLang;
  sourcePath: string;
  outputHtmlPath: string;
  outputRawPath: string;
  routePath: string;
  rawRoutePath: string;
  aggregation?: RepoAggregation;
}

const ROOT = process.cwd();
const REPORTS_DIR = resolve(ROOT, "reports");
const DATA_DIR = resolve(ROOT, "data", "aggregated");
const SITE_DIR = resolve(ROOT, "site");
const DEFAULT_HOME_SLUG = "anthropics-claude-code";
const UI_LANGS: UiLang[] = ["en", "zh"];
const REPORT_LANGS: ReportLang[] = ["en", "zh"];

const COPY_BY_UI_LANG: Record<UiLang, ReportLang> = {
  en: "en",
  zh: "zh",
};

const ui = {
  en: {
    htmlLang: "en",
    siteName: "ReadYourUsers",
    navHome: "Home",
    navLatest: "Latest",
    navArchive: "Archive",
    navGitHub: "GitHub",
    footer: "Built from public GitHub issues. Signals, not a full census.",
    heroEyebrow: "Public issue intelligence",
    heroTitle: "What developers actually want from AI coding tools",
    heroCopy:
      "ReadYourUsers turns GitHub issues into ranked user-demand maps. The homepage focuses on <strong>{name}</strong>, with fast paths to the latest reports and weekly history.",
    heroPrimary: "Read latest report",
    heroSecondary: "Browse history",
    statsIssues: "Issues analyzed",
    statsIncluded: "Included in ranking",
    statsClusters: "Need clusters",
    statsUpdated: "Updated",
    snapshotEyebrow: "Latest snapshot",
    risingEyebrow: "Rising now",
    risingTitle: "Fastest-rising needs",
    otherEyebrow: "Other repos",
    otherTitle: "Latest reports",
    otherEmpty: "No additional repo reports yet.",
    historyEyebrow: "History",
    historyTitle: "Recent archive weeks",
    reportEn: "EN",
    reportZh: "ZH",
    markdown: "Markdown",
    latestIntroEyebrow: "Latest reports",
    latestIntroTitle: "Current snapshots",
    latestIntroCopy: "Fresh demand maps generated from the most recent pipeline run.",
    archiveIntroEyebrow: "Archive",
    archiveIntroTitle: "Weekly history",
    archiveIntroCopy: "Browse prior report generations by week.",
    reportsCount: "reports",
    reportPageLatest: "Latest report",
    reportPageArchive: "Archive report",
    rawMarkdown: "View raw Markdown",
    switchToEnglish: "English",
    switchToChinese: "中文",
    repoCardIssues: "issues analyzed",
    repoCardClusters: "need clusters",
    clusterIssues: "issues",
    clusterDemand: "demand",
    languageLabel: "中文",
    rootRedirectTitle: "Redirecting…",
    rootRedirectBody: "Choosing your preferred language…",
    rootRedirectManual: "If you are not redirected automatically, choose a language:",
    rootRedirectEnglish: "English site",
    rootRedirectChinese: "中文站点",
  },
  zh: {
    htmlLang: "zh-CN",
    siteName: "ReadYourUsers",
    navHome: "首页",
    navLatest: "最新",
    navArchive: "归档",
    navGitHub: "GitHub",
    footer: "基于公开 GitHub Issues 构建，代表信号而非完整普查。",
    heroEyebrow: "公开 Issue 情报",
    heroTitle: "开发者真正想要的 AI 编程工具能力",
    heroCopy:
      "ReadYourUsers 把 GitHub issue 转成可读、可排序的用户需求地图。首页默认聚焦 <strong>{name}</strong>，并提供最新报告与历史归档入口。",
    heroPrimary: "查看最新报告",
    heroSecondary: "浏览历史归档",
    statsIssues: "已分析 Issue",
    statsIncluded: "纳入排序",
    statsClusters: "需求簇",
    statsUpdated: "更新时间",
    snapshotEyebrow: "最新快照",
    risingEyebrow: "正在上升",
    risingTitle: "上升最快的需求",
    otherEyebrow: "其他仓库",
    otherTitle: "最新报告",
    otherEmpty: "暂时还没有其他仓库报告。",
    historyEyebrow: "历史",
    historyTitle: "近期归档周次",
    reportEn: "英文",
    reportZh: "中文",
    markdown: "Markdown",
    latestIntroEyebrow: "最新报告",
    latestIntroTitle: "当前快照",
    latestIntroCopy: "查看最近一次生成的需求地图。",
    archiveIntroEyebrow: "历史归档",
    archiveIntroTitle: "周度历史",
    archiveIntroCopy: "按周浏览过去生成的报告。",
    reportsCount: "份报告",
    reportPageLatest: "最新报告",
    reportPageArchive: "归档报告",
    rawMarkdown: "查看原始 Markdown",
    switchToEnglish: "English",
    switchToChinese: "中文",
    repoCardIssues: "条 issue 已分析",
    repoCardClusters: "个需求簇",
    clusterIssues: "条 issue",
    clusterDemand: "需求得分",
    languageLabel: "English",
    rootRedirectTitle: "正在跳转…",
    rootRedirectBody: "正在为你选择更合适的语言版本…",
    rootRedirectManual: "如果没有自动跳转，请手动选择：",
    rootRedirectEnglish: "English site",
    rootRedirectChinese: "中文站点",
  },
} as const;

function readJson<T>(path: string): T | null {
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8")) as T;
}

function ensureDir(path: string): void {
  mkdirSync(path, { recursive: true });
}

function writeText(path: string, content: string): void {
  ensureDir(resolve(path, ".."));
  writeFileSync(path, content, "utf-8");
}

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatDate(value: string | undefined): string {
  return value ? value.slice(0, 10) : "";
}

function prefix(depth: number): string {
  return depth === 0 ? "." : Array.from({ length: depth }, () => "..").join("/");
}

function routeFor(uiLang: UiLang, path: string): string {
  return `${uiLang}/${path}`;
}

function absoluteSitePath(routePath: string): string {
  return resolve(SITE_DIR, routePath);
}

function applyInlineMarkdown(text: string): string {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return html;
}

function markdownToHtml(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) {
      i += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].startsWith("```")) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      out.push(`<pre><code>${escapeHtml(code.join("\n"))}</code></pre>`);
      continue;
    }

    if (/^\|.*\|$/.test(line) && i + 1 < lines.length && /^\|(?:\s*:?-+:?\s*\|)+$/.test(lines[i + 1])) {
      const tableLines: string[] = [line, lines[i + 1]];
      i += 2;
      while (i < lines.length && /^\|.*\|$/.test(lines[i])) {
        tableLines.push(lines[i]);
        i += 1;
      }

      const rows = tableLines.map((row) => row.slice(1, -1).split("|").map((cell) => applyInlineMarkdown(cell.trim())));
      const [header, , ...body] = rows;
      out.push(
        "<table><thead><tr>" +
          header.map((cell) => `<th>${cell}</th>`).join("") +
          "</tr></thead><tbody>" +
          body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("") +
          "</tbody></table>"
      );
      continue;
    }

    if (/^#{1,3}\s/.test(line)) {
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const text = line.replace(/^#{1,3}\s*/, "");
      out.push(`<h${level}>${applyInlineMarkdown(text)}</h${level}>`);
      i += 1;
      continue;
    }

    if (line.trim() === "---") {
      out.push("<hr />");
      i += 1;
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(`<li>${applyInlineMarkdown(lines[i].slice(2))}</li>`);
        i += 1;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    const paragraph: string[] = [line.trim()];
    i += 1;
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith("```") &&
      !/^#{1,3}\s/.test(lines[i]) &&
      lines[i].trim() !== "---" &&
      !lines[i].startsWith("- ") &&
      !/^\|.*\|$/.test(lines[i])
    ) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    out.push(`<p>${applyInlineMarkdown(paragraph.join(" "))}</p>`);
  }

  return out.join("\n");
}

function pageTemplate(params: {
  uiLang: UiLang;
  title: string;
  description: string;
  body: string;
  depth: number;
  routePath: string;
  alternateRoutePath: string;
}): string {
  const { uiLang, title, description, body, depth, routePath, alternateRoutePath } = params;
  const t = ui[uiLang];
  const base = prefix(depth);
  const styleHref = `${base}/assets/style.css`;
  const homeHref = `${base}/${routeFor(uiLang, "index.html")}`;
  const latestHref = `${base}/${routeFor(uiLang, "latest/index.html")}`;
  const archiveHref = `${base}/${routeFor(uiLang, "archive/index.html")}`;
  const altHref = `${base}/${alternateRoutePath}`;

  return `<!doctype html>
<html lang="${t.htmlLang}">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="stylesheet" href="${styleHref}" />
    <link rel="alternate" hreflang="en" href="${uiLang === "en" ? `${base}/${routePath}` : altHref}" />
    <link rel="alternate" hreflang="zh" href="${uiLang === "zh" ? `${base}/${routePath}` : altHref}" />
    <link rel="alternate" hreflang="x-default" href="${base}/index.html" />
  </head>
  <body>
    <div class="shell">
      <header class="site-header">
        <a class="brand" href="${homeHref}">${t.siteName}</a>
        <div class="header-actions">
          <nav class="nav">
            <a href="${homeHref}">${t.navHome}</a>
            <a href="${latestHref}">${t.navLatest}</a>
            <a href="${archiveHref}">${t.navArchive}</a>
            <a href="https://github.com/fanjingwen/ReadYourUsers">${t.navGitHub}</a>
          </nav>
          <a class="lang-switch" href="${altHref}">${uiLang === "en" ? t.switchToChinese : t.switchToEnglish}</a>
        </div>
      </header>
      <main>
        ${body}
      </main>
      <footer class="site-footer">
        <p>${t.footer}</p>
      </footer>
    </div>
  </body>
</html>`;
}

function buildClusterCard(cluster: NeedCluster, uiLang: UiLang): string {
  const t = ui[uiLang];
  const issues = cluster.issue_urls
    .slice(0, 3)
    .map((url) => {
      const id = url.split("/").pop() ?? "issue";
      return `<a href="${url}">#${id}</a>`;
    })
    .join(" · ");

  return `<article class="cluster-card">
    <div class="cluster-meta"><span class="pill">${escapeHtml(cluster.category)}</span><span>${cluster.volume} ${t.clusterIssues}</span><span>${cluster.demand_score.toFixed(1)} ${t.clusterDemand}</span></div>
    <h3>${escapeHtml(cluster.title)}</h3>
    <p>${escapeHtml(cluster.summary)}</p>
    <div class="cluster-links">${issues}</div>
  </article>`;
}

function buildHomePage(uiLang: UiLang, defaultEntry: SiteReportEntry, latestEntries: SiteReportEntry[], archiveWeeks: Map<string, SiteReportEntry[]>): string {
  const t = ui[uiLang];
  const aggregation = defaultEntry.aggregation;
  if (!aggregation) throw new Error("Default homepage aggregation missing");

  const topClusters = [...aggregation.clusters].sort((a, b) => b.demand_score - a.demand_score).slice(0, 6);
  const risingClusters = [...aggregation.clusters].filter((c) => c.rising_score > 1).sort((a, b) => b.rising_score - a.rising_score).slice(0, 5);
  const recentWeeks = Array.from(archiveWeeks.keys()).sort().reverse().slice(0, 8);
  const otherRepos = latestEntries.filter((entry) => entry.slug !== defaultEntry.slug && entry.reportLang === COPY_BY_UI_LANG[uiLang]);
  const latestReportRoute = `${routeFor(uiLang, `latest/${defaultEntry.slug}.html`)}`;
  const latestMarkdownRoute = `reports/latest/${defaultEntry.slug}${uiLang === "zh" ? ".zh" : ""}.md`;

  const body = `
    <section class="hero">
      <div>
        <p class="eyebrow">${t.heroEyebrow}</p>
        <h1>${t.heroTitle}</h1>
        <p class="hero-copy">${t.heroCopy.replace("{name}", escapeHtml(defaultEntry.displayName))}</p>
        <div class="hero-actions">
          <a class="button primary" href="../${latestReportRoute}">${t.heroPrimary}</a>
          <a class="button" href="../${routeFor(uiLang, "archive/index.html")}">${t.heroSecondary}</a>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><span>${t.statsIssues}</span><strong>${aggregation.total_issues_analyzed}</strong></div>
        <div class="stat-card"><span>${t.statsIncluded}</span><strong>${aggregation.total_issues_included}</strong></div>
        <div class="stat-card"><span>${t.statsClusters}</span><strong>${aggregation.clusters.length}</strong></div>
        <div class="stat-card"><span>${t.statsUpdated}</span><strong>${formatDate(aggregation.generated_at)}</strong></div>
      </div>
    </section>

    <section class="section-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">${t.snapshotEyebrow}</p>
            <h2>${escapeHtml(defaultEntry.displayName)}</h2>
          </div>
          <div class="report-links">
            <a href="../${routeFor("en", `latest/${defaultEntry.slug}.html`)}">${t.reportEn}</a>
            <a href="../${routeFor("zh", `latest/${defaultEntry.slug}.html`)}">${t.reportZh}</a>
            <a href="../${latestMarkdownRoute}">${t.markdown}</a>
          </div>
        </div>
        <div class="cluster-grid">
          ${topClusters.map((cluster) => buildClusterCard(cluster, uiLang)).join("\n")}
        </div>
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
    description: t.heroTitle,
    body,
    depth: 1,
    routePath: routeFor(uiLang, "index.html"),
    alternateRoutePath: routeFor(uiLang === "en" ? "zh" : "en", "index.html"),
  });
}

function buildLatestIndex(uiLang: UiLang, entries: SiteReportEntry[]): string {
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

function buildArchiveIndex(uiLang: UiLang, archiveWeeks: Map<string, SiteReportEntry[]>): string {
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

function buildReportPage(uiLang: UiLang, entry: SiteReportEntry): string {
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
  const body = `<section class="page-intro narrow"><p class="eyebrow">${entry.week ? t.reportPageArchive : t.reportPageLatest}</p><h1>${escapeHtml(reportLabel)}</h1><div class="report-links"><a href="${rawHref}">${t.rawMarkdown}</a><a href="${alternateHref}">${uiLang === "en" ? t.switchToChinese : t.switchToEnglish}</a></div></section><article class="markdown-body">${html}</article>`;

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

function rootRedirectPage(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${ui.en.rootRedirectTitle}</title>
    <meta name="robots" content="noindex" />
    <script>
      const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
      const target = lang.startsWith('zh') ? './zh/index.html' : './en/index.html';
      window.location.replace(target);
    </script>
    <style>
      body { font-family: Inter, system-ui, sans-serif; padding: 48px 20px; max-width: 720px; margin: 0 auto; line-height: 1.6; }
      a { display: inline-block; margin-right: 16px; }
    </style>
  </head>
  <body>
    <h1>${ui.en.rootRedirectTitle}</h1>
    <p>${ui.en.rootRedirectBody}</p>
    <p>${ui.en.rootRedirectManual}</p>
    <p><a href="./en/index.html">${ui.en.rootRedirectEnglish}</a><a href="./zh/index.html">${ui.en.rootRedirectChinese}</a></p>
  </body>
</html>`;
}

function siteCss(): string {
  return `:root {
  color-scheme: light dark;
  --bg: #0b1020;
  --panel: #121a31;
  --panel-soft: #18213d;
  --text: #ecf2ff;
  --muted: #9db0d2;
  --line: rgba(255,255,255,.12);
  --accent: #7cc4ff;
  --accent-strong: #49a6ff;
  --shadow: 0 18px 48px rgba(0,0,0,.25);
}
@media (prefers-color-scheme: light) {
  :root {
    --bg: #f4f7fb;
    --panel: #ffffff;
    --panel-soft: #eef4ff;
    --text: #172033;
    --muted: #5b6c89;
    --line: rgba(23,32,51,.1);
    --accent: #0f6fff;
    --accent-strong: #0057d8;
    --shadow: 0 16px 36px rgba(18,26,49,.08);
  }
}
* { box-sizing: border-box; }
body { margin: 0; font: 16px/1.6 Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: radial-gradient(circle at top, var(--panel-soft), var(--bg) 40%); color: var(--text); }
a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }
.shell { width: min(1200px, calc(100% - 32px)); margin: 0 auto; padding: 24px 0 48px; }
.site-header, .site-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.site-header { margin-bottom: 32px; }
.brand { font-weight: 800; font-size: 1.1rem; color: var(--text); }
.header-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
.nav { display: flex; gap: 16px; flex-wrap: wrap; }
.lang-switch { padding: 8px 12px; border-radius: 999px; border: 1px solid var(--line); }
.site-footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--line); color: var(--muted); }
.hero { display: grid; grid-template-columns: 1.3fr .9fr; gap: 24px; margin-bottom: 28px; }
.section-grid { display: grid; grid-template-columns: 1.35fr .75fr; gap: 24px; }
.sidebar-stack { display: grid; gap: 20px; }
.panel, .stat-card, .repo-card, .cluster-card { background: color-mix(in srgb, var(--panel) 92%, transparent); border: 1px solid var(--line); border-radius: 20px; box-shadow: var(--shadow); }
.panel, .repo-card { padding: 22px; }
.panel.compact { padding: 18px 20px; }
.hero .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.stat-card { padding: 18px; display: flex; flex-direction: column; gap: 6px; }
.stat-card span { color: var(--muted); font-size: .92rem; }
.stat-card strong { font-size: 1.7rem; }
.eyebrow { text-transform: uppercase; letter-spacing: .12em; color: var(--muted); font-size: .78rem; margin: 0 0 8px; }
h1,h2,h3 { line-height: 1.2; margin: 0 0 10px; }
h1 { font-size: clamp(2rem, 3.8vw, 3.4rem); }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.05rem; }
.hero-copy, .page-intro p { color: var(--muted); max-width: 68ch; }
.hero-actions, .report-links { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.button { display: inline-flex; align-items: center; justify-content: center; padding: 10px 16px; border-radius: 999px; border: 1px solid var(--line); background: transparent; color: var(--text); }
.button.primary { background: var(--accent); color: white; border-color: transparent; }
.panel-header, .repo-card-head { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; }
.cluster-grid, .repo-grid { display: grid; gap: 18px; }
.cluster-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.repo-grid { grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); }
.cluster-card { padding: 18px; }
.cluster-card p, .repo-card p, .link-list span, .archive-list span { color: var(--muted); }
.cluster-meta { display: flex; gap: 10px; flex-wrap: wrap; color: var(--muted); font-size: .85rem; margin-bottom: 10px; }
.pill { display: inline-flex; padding: 4px 10px; border-radius: 999px; background: var(--panel-soft); color: var(--accent-strong); }
.link-list, .archive-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
.link-list li, .archive-list li { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
.page-intro { margin-bottom: 22px; }
.page-intro.narrow { margin-bottom: 18px; }
.archive-panel { margin-bottom: 20px; }
.markdown-body { background: color-mix(in srgb, var(--panel) 95%, transparent); border: 1px solid var(--line); border-radius: 20px; box-shadow: var(--shadow); padding: 24px; }
.markdown-body h1, .markdown-body h2, .markdown-body h3 { margin-top: 1.25em; }
.markdown-body h1:first-child, .markdown-body h2:first-child, .markdown-body h3:first-child { margin-top: 0; }
.markdown-body p, .markdown-body li { color: var(--text); }
.markdown-body ul { padding-left: 1.25rem; }
.markdown-body table { width: 100%; border-collapse: collapse; margin: 18px 0; font-size: .95rem; }
.markdown-body th, .markdown-body td { border: 1px solid var(--line); padding: 10px 12px; text-align: left; vertical-align: top; }
.markdown-body th { background: var(--panel-soft); }
.markdown-body pre { overflow: auto; padding: 16px; border-radius: 14px; background: var(--panel-soft); }
.markdown-body code { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
hr { border: none; border-top: 1px solid var(--line); margin: 24px 0; }
@media (max-width: 980px) {
  .hero, .section-grid { grid-template-columns: 1fr; }
  .cluster-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .site-header, .site-footer, .panel-header, .repo-card-head, .archive-list li, .link-list li, .header-actions { flex-direction: column; align-items: flex-start; }
  .hero .stats-grid { grid-template-columns: 1fr 1fr; }
}
`;
}

function collectLatestEntries(configs: RepoConfig[]): SiteReportEntry[] {
  const entries: SiteReportEntry[] = [];

  for (const uiLang of UI_LANGS) {
    for (const config of configs) {
      const slug = repoSlug(config.repo);
      const reportLang = COPY_BY_UI_LANG[uiLang];
      const suffix = reportLang === "zh" ? ".zh" : "";
      const sourcePath = resolve(REPORTS_DIR, "latest", `${slug}${suffix}.md`);
      if (!existsSync(sourcePath)) continue;
      entries.push({
        repo: config.repo,
        slug,
        displayName: config.display_name,
        reportLang,
        sourcePath,
        outputHtmlPath: absoluteSitePath(routeFor(uiLang, `latest/${slug}.html`)),
        outputRawPath: absoluteSitePath(`reports/latest/${slug}${suffix}.md`),
        routePath: routeFor(uiLang, `latest/${slug}.html`),
        rawRoutePath: `reports/latest/${slug}${suffix}.md`,
        aggregation: readJson<RepoAggregation>(resolve(DATA_DIR, slug, "clusters.json")) ?? undefined,
      });
    }
  }

  return entries;
}

function collectArchiveEntries(configs: RepoConfig[]): Map<string, SiteReportEntry[]> {
  const map = new Map<string, SiteReportEntry[]>();
  const archiveRoot = resolve(REPORTS_DIR, "archive");
  if (!existsSync(archiveRoot)) return map;

  const configBySlug = new Map(configs.map((config) => [repoSlug(config.repo), config]));
  const weeks = readdirSync(archiveRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);

  for (const week of weeks) {
    const weekDir = resolve(archiveRoot, week);
    const weekEntries: SiteReportEntry[] = [];
    const files = readdirSync(weekDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && extname(entry.name) === ".md");

    for (const uiLang of UI_LANGS) {
      for (const file of files) {
        const fileReportLang: ReportLang = file.name.endsWith(".zh.md") ? "zh" : "en";
        if (fileReportLang !== COPY_BY_UI_LANG[uiLang]) continue;
        const slug = file.name.replace(/\.zh\.md$|\.md$/g, "");
        const config = configBySlug.get(slug);
        weekEntries.push({
          repo: config?.repo ?? slug,
          slug,
          displayName: config?.display_name ?? slug,
          week,
          reportLang: fileReportLang,
          sourcePath: resolve(weekDir, file.name),
          outputHtmlPath: absoluteSitePath(routeFor(uiLang, `archive/${week}/${slug}.html`)),
          outputRawPath: absoluteSitePath(`reports/archive/${week}/${file.name}`),
          routePath: routeFor(uiLang, `archive/${week}/${slug}.html`),
          rawRoutePath: `reports/archive/${week}/${file.name}`,
        });
      }
    }

    map.set(week, weekEntries.sort((a, b) => a.routePath.localeCompare(b.routePath)));
  }

  return map;
}

function main(): void {
  const configs = loadRepoConfigs(resolve(ROOT, "config", "repos.json"));
  const latestEntries = collectLatestEntries(configs);
  const archiveEntries = collectArchiveEntries(configs);

  if (latestEntries.length === 0) {
    throw new Error("No latest reports found. Run the report generator first.");
  }

  rmSync(SITE_DIR, { recursive: true, force: true });
  ensureDir(resolve(SITE_DIR, "assets"));
  writeText(resolve(SITE_DIR, "assets", "style.css"), siteCss());
  writeText(resolve(SITE_DIR, ".nojekyll"), "");
  writeText(resolve(SITE_DIR, "index.html"), rootRedirectPage());

  for (const entry of latestEntries) {
    writeText(entry.outputHtmlPath, buildReportPage(entry.routePath.startsWith("en/") ? "en" : "zh", entry));
    ensureDir(resolve(entry.outputRawPath, ".."));
    copyFileSync(entry.sourcePath, entry.outputRawPath);
  }

  for (const entries of archiveEntries.values()) {
    for (const entry of entries) {
      writeText(entry.outputHtmlPath, buildReportPage(entry.routePath.startsWith("en/") ? "en" : "zh", entry));
      ensureDir(resolve(entry.outputRawPath, ".."));
      copyFileSync(entry.sourcePath, entry.outputRawPath);
    }
  }

  for (const uiLang of UI_LANGS) {
    const defaultEntry = latestEntries.find((entry) => entry.slug === DEFAULT_HOME_SLUG && entry.routePath.startsWith(`${uiLang}/`))
      ?? latestEntries.find((entry) => entry.routePath.startsWith(`${uiLang}/`));

    if (!defaultEntry) {
      throw new Error(`No ${uiLang} latest report found for homepage.`);
    }

    writeText(
      absoluteSitePath(routeFor(uiLang, "index.html")),
      buildHomePage(uiLang, defaultEntry, latestEntries.filter((entry) => entry.routePath.startsWith(`${uiLang}/`)), archiveEntries)
    );
    writeText(
      absoluteSitePath(routeFor(uiLang, "latest/index.html")),
      buildLatestIndex(uiLang, latestEntries.filter((entry) => entry.routePath.startsWith(`${uiLang}/`)))
    );
    writeText(
      absoluteSitePath(routeFor(uiLang, "archive/index.html")),
      buildArchiveIndex(uiLang, archiveEntries)
    );
  }

  console.log(`Site generated at ${SITE_DIR}`);
}

main();
