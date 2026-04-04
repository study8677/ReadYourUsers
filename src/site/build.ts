import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadRepoConfigs, repoSlug, type RepoConfig } from "../config/repos.js";
import type { RepoAggregation } from "../models/cluster.js";
import type { CrossProductSummary } from "../models/site.js";
import { ui, type UiLang } from "./i18n.js";
import { routeFor, type ReportLang, type SiteReportEntry, type SitePaths } from "./html.js";
import { buildHomePage } from "./pages/home.js";
import { buildObservatoryHomePage } from "./pages/observatory.js";
import { buildComparePage, getVisibleProducts } from "./pages/compare.js";
import { buildToolsPage } from "./pages/tools.js";
import { buildProductPage } from "./pages/product.js";
import { buildReportPrintPage, buildProductPrintPage } from "./pages/print.js";
import { buildLatestIndex, buildArchiveIndex, buildReportPage } from "./pages/reports.js";

const DEFAULT_HOME_SLUG = "anthropics-claude-code";
const UI_LANGS: UiLang[] = ["en", "zh"];
const REPORT_LANGS: ReportLang[] = ["en", "zh"];
const COPY_BY_UI_LANG: Record<UiLang, ReportLang> = {
  en: "en",
  zh: "zh",
};

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

function getSitePaths(rootDir: string): SitePaths {
  return {
    rootDir,
    reportsDir: resolve(rootDir, "reports"),
    dataDir: resolve(rootDir, "data", "aggregated"),
    siteDir: resolve(rootDir, "site"),
  };
}

function absoluteSitePath(siteDir: string, routePath: string): string {
  return resolve(siteDir, routePath);
}

function readCrossProductSummary(paths: SitePaths): CrossProductSummary | null {
  return readJson<CrossProductSummary>(resolve(paths.reportsDir, "latest", "cross-product.json"));
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
.insight-panel { margin-bottom: 24px; }
.insight-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.insight-card { padding: 18px; border: 1px solid var(--line); border-radius: 18px; background: color-mix(in srgb, var(--panel-soft) 78%, transparent); }
.insight-label { display: inline-block; margin-bottom: 10px; font-size: .8rem; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); }
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
.top-five-list { list-style: none; padding: 0; margin: 0; display: grid; gap: 16px; }
.top-five-item { display: grid; grid-template-columns: 56px 1fr; gap: 16px; padding: 18px; border: 1px solid var(--line); border-radius: 18px; background: color-mix(in srgb, var(--panel-soft) 72%, transparent); }
.top-five-rank { width: 56px; height: 56px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.35rem; font-weight: 800; background: var(--accent); color: white; }
.top-five-main { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 8px; }
.top-five-main h3 { margin: 0; }
.top-five-item p { margin: 0 0 10px; color: var(--muted); }
.top-five-meta { display: flex; gap: 16px; flex-wrap: wrap; color: var(--muted); font-size: .92rem; }
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
  .insight-grid,
  .cluster-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .site-header, .site-footer, .panel-header, .repo-card-head, .archive-list li, .link-list li, .header-actions { flex-direction: column; align-items: flex-start; }
  .hero .stats-grid { grid-template-columns: 1fr 1fr; }
  .top-five-item { grid-template-columns: 1fr; }
  .top-five-rank { width: 48px; height: 48px; border-radius: 14px; }
}
`;
}

function collectLatestEntries(configs: RepoConfig[], paths: SitePaths): SiteReportEntry[] {
  const entries: SiteReportEntry[] = [];

  for (const uiLang of UI_LANGS) {
    for (const config of configs) {
      const slug = repoSlug(config.repo);
      const reportLang = COPY_BY_UI_LANG[uiLang];
      const suffix = reportLang === "zh" ? ".zh" : "";
      const sourcePath = resolve(paths.reportsDir, "latest", `${slug}${suffix}.md`);
      if (!existsSync(sourcePath)) continue;
      entries.push({
        repo: config.repo,
        slug,
        displayName: config.display_name,
        reportLang,
        sourcePath,
        outputHtmlPath: absoluteSitePath(paths.siteDir, routeFor(uiLang, `latest/${slug}.html`)),
        outputRawPath: absoluteSitePath(paths.siteDir, `reports/latest/${slug}${suffix}.md`),
        routePath: routeFor(uiLang, `latest/${slug}.html`),
        rawRoutePath: `reports/latest/${slug}${suffix}.md`,
        aggregation: readJson<RepoAggregation>(resolve(paths.dataDir, slug, "clusters.json")) ?? undefined,
      });
    }
  }

  return entries;
}

function collectArchiveEntries(configs: RepoConfig[], paths: SitePaths): Map<string, SiteReportEntry[]> {
  const map = new Map<string, SiteReportEntry[]>();
  const archiveRoot = resolve(paths.reportsDir, "archive");
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
          outputHtmlPath: absoluteSitePath(paths.siteDir, routeFor(uiLang, `archive/${week}/${slug}.html`)),
          outputRawPath: absoluteSitePath(paths.siteDir, `reports/archive/${week}/${file.name}`),
          routePath: routeFor(uiLang, `archive/${week}/${slug}.html`),
          rawRoutePath: `reports/archive/${week}/${file.name}`,
        });
      }
    }

    map.set(week, weekEntries.sort((a, b) => a.routePath.localeCompare(b.routePath)));
  }

  return map;
}

export function buildSite(rootDir = process.cwd()): void {
  const paths = getSitePaths(rootDir);
  const configs = loadRepoConfigs(resolve(paths.rootDir, "config", "repos.json"));
  const latestEntries = collectLatestEntries(configs, paths);
  const archiveEntries = collectArchiveEntries(configs, paths);
  const summary = readCrossProductSummary(paths);

  if (latestEntries.length === 0) {
    throw new Error("No latest reports found. Run the report generator first.");
  }

  rmSync(paths.siteDir, { recursive: true, force: true });
  ensureDir(resolve(paths.siteDir, "assets"));
  writeText(resolve(paths.siteDir, "assets", "style.css"), siteCss());
  writeText(resolve(paths.siteDir, ".nojekyll"), "");
  writeText(resolve(paths.siteDir, "index.html"), rootRedirectPage());

  for (const entry of latestEntries) {
    const entryLang: UiLang = entry.routePath.startsWith("en/") ? "en" : "zh";
    writeText(entry.outputHtmlPath, buildReportPage(entryLang, entry));
    ensureDir(resolve(entry.outputRawPath, ".."));
    copyFileSync(entry.sourcePath, entry.outputRawPath);
    // Generate print-optimized page for PDF download
    writeText(
      absoluteSitePath(paths.siteDir, routeFor(entryLang, `print/${entry.slug}.html`)),
      buildReportPrintPage(entryLang, entry)
    );
  }

  for (const entries of archiveEntries.values()) {
    for (const entry of entries) {
      writeText(entry.outputHtmlPath, buildReportPage(entry.routePath.startsWith("en/") ? "en" : "zh", entry));
      ensureDir(resolve(entry.outputRawPath, ".."));
      copyFileSync(entry.sourcePath, entry.outputRawPath);
    }
  }

  for (const uiLang of UI_LANGS) {
    const visibleProducts = getVisibleProducts(summary, latestEntries, uiLang);
    const defaultEntry = latestEntries.find((entry) => entry.slug === DEFAULT_HOME_SLUG && entry.routePath.startsWith(`${uiLang}/`))
      ?? latestEntries.find((entry) => entry.routePath.startsWith(`${uiLang}/`));

    if (!defaultEntry) {
      throw new Error(`No ${uiLang} latest report found for homepage.`);
    }

    writeText(
      absoluteSitePath(paths.siteDir, routeFor(uiLang, "index.html")),
      visibleProducts.length > 0 && summary
        ? buildObservatoryHomePage(uiLang, summary, visibleProducts, archiveEntries)
        : buildHomePage(uiLang, defaultEntry, latestEntries.filter((entry) => entry.routePath.startsWith(`${uiLang}/`)), archiveEntries)
    );
    writeText(
      absoluteSitePath(paths.siteDir, routeFor(uiLang, "latest/index.html")),
      buildLatestIndex(uiLang, latestEntries.filter((entry) => entry.routePath.startsWith(`${uiLang}/`)))
    );
    writeText(
      absoluteSitePath(paths.siteDir, routeFor(uiLang, "archive/index.html")),
      buildArchiveIndex(uiLang, archiveEntries)
    );
    writeText(
      absoluteSitePath(paths.siteDir, routeFor(uiLang, "compare/index.html")),
      buildComparePage(uiLang, summary, visibleProducts)
    );

    writeText(
      absoluteSitePath(paths.siteDir, routeFor(uiLang, "tools/index.html")),
      buildToolsPage(uiLang, visibleProducts)
    );

    for (const product of visibleProducts) {
      writeText(
        absoluteSitePath(paths.siteDir, routeFor(uiLang, `products/${product.slug}.html`)),
        buildProductPage(uiLang, product)
      );
      // Generate print-optimized page for PDF download
      writeText(
        absoluteSitePath(paths.siteDir, routeFor(uiLang, `print/product-${product.slug}.html`)),
        buildProductPrintPage(uiLang, product)
      );
    }
  }

  console.log(`Site generated at ${paths.siteDir}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildSite();
}
