import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { resolve, basename, extname } from "node:path";
import { loadRepoConfigs, repoSlug, type RepoConfig } from "../config/repos.js";
import type { RepoAggregation, NeedCluster } from "../models/cluster.js";

interface SiteReportEntry {
  repo: string;
  slug: string;
  displayName: string;
  week?: string;
  lang: "en" | "zh";
  sourcePath: string;
  outputHtmlPath: string;
  outputRawPath: string;
  webPath: string;
  rawWebPath: string;
  aggregation?: RepoAggregation;
}

const ROOT = process.cwd();
const REPORTS_DIR = resolve(ROOT, "reports");
const DATA_DIR = resolve(ROOT, "data", "aggregated");
const SITE_DIR = resolve(ROOT, "site");
const DEFAULT_HOME_SLUG = "anthropics-claude-code";

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

function formatDate(value: string): string {
  return value.slice(0, 10);
}

function prefix(depth: number): string {
  return depth === 0 ? "." : Array.from({ length: depth }, () => "..").join("/");
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
      out.push("<table><thead><tr>" + header.map((cell) => `<th>${cell}</th>`).join("") + "</tr></thead><tbody>" +
        body.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("") +
        "</tbody></table>");
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
  title: string;
  description: string;
  body: string;
  depth: number;
}): string {
  const { title, description, body, depth } = params;
  const base = prefix(depth);
  const styleHref = `${base}/assets/style.css`;
  const homeHref = `${base}/index.html`;
  const latestHref = `${base}/latest/index.html`;
  const archiveHref = `${base}/archive/index.html`;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="stylesheet" href="${styleHref}" />
  </head>
  <body>
    <div class="shell">
      <header class="site-header">
        <a class="brand" href="${homeHref}">ReadYourUsers</a>
        <nav class="nav">
          <a href="${homeHref}">Home</a>
          <a href="${latestHref}">Latest</a>
          <a href="${archiveHref}">Archive</a>
          <a href="https://github.com/fanjingwen/ReadYourUsers">GitHub</a>
        </nav>
      </header>
      <main>
        ${body}
      </main>
      <footer class="site-footer">
        <p>Built from public GitHub issues. Signals, not a full census.</p>
      </footer>
    </div>
  </body>
</html>`;
}

function reportCard(cluster: NeedCluster): string {
  const issues = cluster.issue_urls.slice(0, 3)
    .map((url) => {
      const id = url.split("/").pop() ?? "issue";
      return `<a href="${url}">#${id}</a>`;
    })
    .join(" · ");

  return `<article class="cluster-card">
    <div class="cluster-meta"><span class="pill">${escapeHtml(cluster.category)}</span><span>${cluster.volume} issues</span><span>${cluster.demand_score.toFixed(1)} demand</span></div>
    <h3>${escapeHtml(cluster.title)}</h3>
    <p>${escapeHtml(cluster.summary)}</p>
    <div class="cluster-links">${issues}</div>
  </article>`;
}

function buildHomePage(defaultEntry: SiteReportEntry, latestEntries: SiteReportEntry[], archiveWeeks: Map<string, SiteReportEntry[]>): string {
  const aggregation = defaultEntry.aggregation;
  if (!aggregation) throw new Error("Default homepage aggregation missing");

  const topClusters = [...aggregation.clusters].sort((a, b) => b.demand_score - a.demand_score).slice(0, 6);
  const risingClusters = [...aggregation.clusters].filter((c) => c.rising_score > 1).sort((a, b) => b.rising_score - a.rising_score).slice(0, 5);
  const recentWeeks = Array.from(archiveWeeks.keys()).sort().reverse().slice(0, 8);
  const otherRepos = latestEntries.filter((entry) => entry.slug !== defaultEntry.slug && entry.lang === "en");

  const body = `
    <section class="hero">
      <div>
        <p class="eyebrow">Public issue intelligence</p>
        <h1>What developers actually want from AI coding tools</h1>
        <p class="hero-copy">ReadYourUsers turns GitHub issues into ranked user-demand maps. The homepage focuses on <strong>${escapeHtml(defaultEntry.displayName)}</strong>, with fast paths to the latest reports and weekly history.</p>
        <div class="hero-actions">
          <a class="button primary" href="latest/${defaultEntry.slug}.html">Read latest report</a>
          <a class="button" href="archive/index.html">Browse history</a>
        </div>
      </div>
      <div class="stats-grid">
        <div class="stat-card"><span>Issues analyzed</span><strong>${aggregation.total_issues_analyzed}</strong></div>
        <div class="stat-card"><span>Included in ranking</span><strong>${aggregation.total_issues_included}</strong></div>
        <div class="stat-card"><span>Need clusters</span><strong>${aggregation.clusters.length}</strong></div>
        <div class="stat-card"><span>Updated</span><strong>${formatDate(aggregation.generated_at)}</strong></div>
      </div>
    </section>

    <section class="section-grid">
      <section class="panel">
        <div class="panel-header">
          <div>
            <p class="eyebrow">Latest snapshot</p>
            <h2>${escapeHtml(defaultEntry.displayName)}</h2>
          </div>
          <div class="report-links">
            <a href="latest/${defaultEntry.slug}.html">EN</a>
            <a href="latest/${defaultEntry.slug}.zh.html">ZH</a>
            <a href="reports/latest/${defaultEntry.slug}.md">Markdown</a>
          </div>
        </div>
        <div class="cluster-grid">
          ${topClusters.map(reportCard).join("\n")}
        </div>
      </section>

      <aside class="sidebar-stack">
        <section class="panel compact">
          <p class="eyebrow">Rising now</p>
          <h2>Fastest-rising needs</h2>
          <ul class="link-list">
            ${risingClusters.map((cluster) => `<li><strong>${escapeHtml(cluster.title)}</strong><span>${cluster.rising_score === Infinity ? "NEW" : `${cluster.rising_score.toFixed(1)}x`} · ${escapeHtml(cluster.category)}</span></li>`).join("")}
          </ul>
        </section>

        <section class="panel compact">
          <p class="eyebrow">Other repos</p>
          <h2>Latest reports</h2>
          <ul class="link-list">
            ${otherRepos.length > 0 ? otherRepos.map((entry) => `<li><a href="latest/${entry.slug}.html">${escapeHtml(entry.displayName)}</a><span>${formatDate(entry.aggregation?.generated_at ?? "")}</span></li>`).join("") : '<li><span>No additional repo reports yet.</span></li>'}
          </ul>
        </section>

        <section class="panel compact">
          <p class="eyebrow">History</p>
          <h2>Recent archive weeks</h2>
          <ul class="link-list">
            ${recentWeeks.map((week) => `<li><a href="archive/index.html#${week}">${week}</a><span>${archiveWeeks.get(week)?.length ?? 0} report files</span></li>`).join("")}
          </ul>
        </section>
      </aside>
    </section>`;

  return pageTemplate({
    title: "ReadYourUsers",
    description: "Ranked GitHub issue demand maps with latest and historical report views.",
    body,
    depth: 0,
  });
}

function buildLatestIndex(entries: SiteReportEntry[]): string {
  const cards = entries
    .filter((entry) => entry.lang === "en")
    .sort((a, b) => (b.aggregation?.generated_at ?? "").localeCompare(a.aggregation?.generated_at ?? ""))
    .map((entry) => `<article class="repo-card">
      <div class="repo-card-head">
        <h2><a href="${basename(entry.webPath)}">${escapeHtml(entry.displayName)}</a></h2>
        <span>${formatDate(entry.aggregation?.generated_at ?? "")}</span>
      </div>
      <p>${entry.aggregation?.total_issues_analyzed ?? 0} issues analyzed · ${entry.aggregation?.clusters.length ?? 0} need clusters</p>
      <div class="report-links">
        <a href="${basename(entry.webPath)}">Read EN</a>
        <a href="${entry.slug}.zh.html">Read ZH</a>
        <a href="../reports/latest/${entry.slug}.md">Markdown</a>
      </div>
    </article>`)
    .join("\n");

  return pageTemplate({
    title: "Latest reports — ReadYourUsers",
    description: "Latest generated reports across tracked repositories.",
    body: `<section class="page-intro"><p class="eyebrow">Latest reports</p><h1>Current snapshots</h1><p>Fresh demand maps generated from the most recent pipeline run.</p></section><section class="repo-grid">${cards}</section>`,
    depth: 1,
  });
}

function buildArchiveIndex(archiveWeeks: Map<string, SiteReportEntry[]>): string {
  const weeks = Array.from(archiveWeeks.keys()).sort().reverse();
  const sections = weeks.map((week) => {
    const entries = (archiveWeeks.get(week) ?? []).filter((entry) => entry.lang === "en");
    return `<section class="panel archive-panel" id="${week}">
      <div class="panel-header"><h2>${week}</h2><span>${entries.length} reports</span></div>
      <ul class="archive-list">
        ${entries.map((entry) => `<li><a href="${week}/${entry.slug}.html">${escapeHtml(entry.displayName)}</a><span><a href="${week}/${entry.slug}.zh.html">ZH</a> · <a href="../reports/archive/${week}/${entry.slug}.md">Markdown</a></span></li>`).join("")}
      </ul>
    </section>`;
  }).join("\n");

  return pageTemplate({
    title: "Archive — ReadYourUsers",
    description: "Historical weekly demand reports.",
    body: `<section class="page-intro"><p class="eyebrow">Archive</p><h1>Weekly history</h1><p>Browse prior report generations by week.</p></section>${sections}`,
    depth: 1,
  });
}

function buildReportPage(entry: SiteReportEntry): string {
  const markdown = readFileSync(entry.sourcePath, "utf-8");
  const html = markdownToHtml(markdown);
  const reportLabel = entry.week ? `${entry.displayName} · ${entry.week}` : `${entry.displayName} · latest`;

  const depth = entry.week ? 2 : 1;
  const base = prefix(depth);
  const rawHref = `${base}/${entry.rawWebPath}`;
  const altLangHref = entry.lang === "en"
    ? basename(entry.webPath).replace(/\.html$/, ".zh.html")
    : basename(entry.webPath).replace(/\.zh\.html$/, ".html");
  const body = `<section class="page-intro narrow"><p class="eyebrow">${entry.week ? "Archive report" : "Latest report"}</p><h1>${escapeHtml(reportLabel)}</h1><div class="report-links"><a href="${rawHref}">View raw Markdown</a><a href="${altLangHref}">${entry.lang === "en" ? "中文" : "English"}</a></div></section><article class="markdown-body">${html}</article>`;

  return pageTemplate({
    title: `${reportLabel} — ReadYourUsers`,
    description: `Demand report for ${entry.displayName}.`,
    body,
    depth,
  });
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
.nav { display: flex; gap: 16px; flex-wrap: wrap; }
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
  .site-header, .site-footer, .panel-header, .repo-card-head, .archive-list li, .link-list li { flex-direction: column; align-items: flex-start; }
  .hero .stats-grid { grid-template-columns: 1fr 1fr; }
}
`;
}

function collectLatestEntries(configs: RepoConfig[]): SiteReportEntry[] {
  return configs.flatMap((config) => {
    const slug = repoSlug(config.repo);
    const aggregation = readJson<RepoAggregation>(resolve(DATA_DIR, slug, "clusters.json")) ?? undefined;
    const entries: SiteReportEntry[] = [];

    for (const lang of ["en", "zh"] as const) {
      const suffix = lang === "zh" ? ".zh" : "";
      const sourcePath = resolve(REPORTS_DIR, "latest", `${slug}${suffix}.md`);
      if (!existsSync(sourcePath)) continue;
      entries.push({
        repo: config.repo,
        slug,
        displayName: config.display_name,
        lang,
        sourcePath,
        outputHtmlPath: resolve(SITE_DIR, "latest", `${slug}${suffix}.html`),
        outputRawPath: resolve(SITE_DIR, "reports", "latest", `${slug}${suffix}.md`),
        webPath: `latest/${slug}${suffix}.html`,
        rawWebPath: `reports/latest/${slug}${suffix}.md`,
        aggregation,
      });
    }

    return entries;
  });
}

function collectArchiveEntries(configs: RepoConfig[]): Map<string, SiteReportEntry[]> {
  const map = new Map<string, SiteReportEntry[]>();
  const archiveRoot = resolve(REPORTS_DIR, "archive");
  if (!existsSync(archiveRoot)) return map;

  const configBySlug = new Map(configs.map((config) => [repoSlug(config.repo), config]));
  const weeks = readdirSync(archiveRoot, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);

  for (const week of weeks) {
    const weekDir = resolve(archiveRoot, week);
    const entries: SiteReportEntry[] = [];
    const files = readdirSync(weekDir, { withFileTypes: true }).filter((entry) => entry.isFile() && extname(entry.name) === ".md");

    for (const file of files) {
      const lang: "en" | "zh" = file.name.endsWith(".zh.md") ? "zh" : "en";
      const slug = file.name.replace(/\.zh\.md$|\.md$/g, "");
      const config = configBySlug.get(slug);
      entries.push({
        repo: config?.repo ?? slug,
        slug,
        displayName: config?.display_name ?? slug,
        week,
        lang,
        sourcePath: resolve(weekDir, file.name),
        outputHtmlPath: resolve(SITE_DIR, "archive", week, `${slug}${lang === "zh" ? ".zh" : ""}.html`),
        outputRawPath: resolve(SITE_DIR, "reports", "archive", week, file.name),
        webPath: `archive/${week}/${slug}${lang === "zh" ? ".zh" : ""}.html`,
        rawWebPath: `reports/archive/${week}/${file.name}`,
      });
    }

    map.set(week, entries.sort((a, b) => a.slug.localeCompare(b.slug) || a.lang.localeCompare(b.lang)));
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

  for (const entry of latestEntries) {
    ensureDir(resolve(entry.outputHtmlPath, ".."));
    ensureDir(resolve(entry.outputRawPath, ".."));
    writeText(entry.outputHtmlPath, buildReportPage(entry));
    copyFileSync(entry.sourcePath, entry.outputRawPath);
  }

  for (const weekEntries of archiveEntries.values()) {
    for (const entry of weekEntries) {
      ensureDir(resolve(entry.outputHtmlPath, ".."));
      ensureDir(resolve(entry.outputRawPath, ".."));
      writeText(entry.outputHtmlPath, buildReportPage(entry));
      copyFileSync(entry.sourcePath, entry.outputRawPath);
    }
  }

  const defaultEntry = latestEntries.find((entry) => entry.slug === DEFAULT_HOME_SLUG && entry.lang === "en")
    ?? latestEntries.find((entry) => entry.lang === "en");

  if (!defaultEntry) {
    throw new Error("No English latest report found for homepage.");
  }

  writeText(resolve(SITE_DIR, "index.html"), buildHomePage(defaultEntry, latestEntries, archiveEntries));
  writeText(resolve(SITE_DIR, "latest", "index.html"), buildLatestIndex(latestEntries));
  writeText(resolve(SITE_DIR, "archive", "index.html"), buildArchiveIndex(archiveEntries));

  console.log(`Site generated at ${SITE_DIR}`);
}

main();
