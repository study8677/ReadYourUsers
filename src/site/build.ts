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
import { fileURLToPath } from "node:url";
import { loadRepoConfigs, repoSlug, type RepoConfig } from "../config/repos.js";
import type { NeedCluster, RepoAggregation } from "../models/cluster.js";
import type { CrossProductSummary, ProductSummaryCard } from "../models/site.js";

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

interface SitePaths {
  rootDir: string;
  reportsDir: string;
  dataDir: string;
  siteDir: string;
}

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
    navCompare: "Compare",
    navGitHub: "GitHub",
    footer: "Built from public GitHub issues. Signals, not a full census.",
    homeObservatoryEyebrow: "Cross-product observatory",
    homeObservatoryTitle: "What AI coding users need right now",
    homeObservatoryCopy:
      "Track the strongest public needs across {count} products, compare shared themes, and drill into each product's latest demand map.",
    homeComparePrimary: "Compare products",
    homeLatestSecondary: "Browse latest reports",
    homeProductsEyebrow: "Products",
    homeProductsTitle: "Latest product snapshots",
    homeSignalsEyebrow: "Signals",
    homeSignalsTitle: "Hottest needs across products",
    homeThemesEyebrow: "Themes",
    homeThemesTitle: "Shared vs unique themes",
    homeStatsProducts: "Products tracked",
    homeStatsSignals: "Hot signals",
    homeStatsSharedThemes: "Shared themes",
    heroEyebrow: "Public issue intelligence",
    heroTitle: "{name} users are shouting about {topDemand}",
    heroCopy:
      "{topVolume} leads by sheer issue volume, while {topDemand} is the strongest weighted demand signal right now. Read the latest snapshot, grab the full report, or browse the archive.",
    heroPrimary: "Read latest report",
    heroSecondary: "Browse history",
    statsIssues: "Issues analyzed",
    statsIncluded: "Included in ranking",
    statsClusters: "Need clusters",
    statsUpdated: "Updated",
    snapshotEyebrow: "Latest snapshot",
    topFiveTitle: "Top 5 needs right now",
    insightEyebrow: "Most shareable takeaways",
    insightTitle: "What stands out immediately",
    insightTopDemand: "Strongest demand signal",
    insightTopVolume: "Most discussed by volume",
    insightTopRising: "Fastest-rising theme",
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
    compareIntroEyebrow: "Cross-product signals",
    compareIntroTitle: "Compare products",
    compareIntroCopy: "See where Claude Code, Codex, and Cursor users overlap and diverge this week.",
    compareProductsTitle: "Product scorecards",
    compareSignalsTitle: "Hottest signals",
    compareSharedTitle: "Shared themes",
    compareUniqueTitle: "Unique themes",
    compareEmptyCopy: "Cross-product summaries will appear here after the summary artifact is generated.",
    productEyebrow: "Product snapshot",
    productTopNeed: "Top need",
    productRisingNeed: "Rising need",
    productDominantCategory: "Dominant category",
    productLatestReport: "Latest report",
    productCompareView: "Compare view",
    productNeedsEyebrow: "Priority map",
    productNeedsTitle: "Top needs right now",
    themeNone: "No exclusive themes yet.",
    reportsCount: "reports",
    reportPageLatest: "Latest report",
    reportPageArchive: "Archive report",
    rawMarkdown: "View raw Markdown",
    switchToEnglish: "English",
    switchToChinese: "中文",
    topFiveIssues: "issues",
    topFiveScore: "score",
    repoCardIssues: "issues analyzed",
    repoCardClusters: "need clusters",
    clusterIssues: "issues",
    clusterDemand: "demand",
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
    navCompare: "对比",
    navGitHub: "GitHub",
    footer: "基于公开 GitHub Issues 构建，代表信号而非完整普查。",
    homeObservatoryEyebrow: "跨产品观察站",
    homeObservatoryTitle: "AI 编程产品用户此刻最在意什么",
    homeObservatoryCopy:
      "跨 {count} 个产品跟踪最强公开需求信号，对比共同主题，并继续下钻到每个产品的最新需求地图。",
    homeComparePrimary: "对比产品",
    homeLatestSecondary: "查看最新报告",
    homeProductsEyebrow: "产品",
    homeProductsTitle: "最新产品快照",
    homeSignalsEyebrow: "信号",
    homeSignalsTitle: "跨产品最热需求",
    homeThemesEyebrow: "主题",
    homeThemesTitle: "共同主题与独有主题",
    homeStatsProducts: "跟踪产品数",
    homeStatsSignals: "热点信号",
    homeStatsSharedThemes: "共同主题",
    heroEyebrow: "公开 Issue 情报",
    heroTitle: "{name} 用户最强烈的信号：{topDemand}",
    heroCopy:
      "{topVolume} 在 issue 数量上最突出，而 {topDemand} 是当前权重最高的需求信号。你可以直接看最新快照、打开完整报告，或者继续浏览历史归档。",
    heroPrimary: "查看最新报告",
    heroSecondary: "浏览历史归档",
    statsIssues: "已分析 Issue",
    statsIncluded: "纳入排序",
    statsClusters: "需求簇",
    statsUpdated: "更新时间",
    snapshotEyebrow: "最新快照",
    topFiveTitle: "当前 Top 5 需求",
    insightEyebrow: "最适合传播的结论",
    insightTitle: "第一眼最值得截图的 3 个点",
    insightTopDemand: "最强需求信号",
    insightTopVolume: "讨论量最高",
    insightTopRising: "上升最快",
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
    compareIntroEyebrow: "跨产品信号",
    compareIntroTitle: "对比产品差异",
    compareIntroCopy: "看看 Claude Code、Codex、Cursor 用户这周关注点在哪里重叠、又在哪里分化。",
    compareProductsTitle: "产品分卡",
    compareSignalsTitle: "最热信号",
    compareSharedTitle: "共同主题",
    compareUniqueTitle: "独有主题",
    compareEmptyCopy: "跨产品汇总产物生成后，这里会出现对比内容。",
    productEyebrow: "产品快照",
    productTopNeed: "头号需求",
    productRisingNeed: "上升需求",
    productDominantCategory: "主导分类",
    productLatestReport: "最新报告",
    productCompareView: "查看对比页",
    productNeedsEyebrow: "优先级地图",
    productNeedsTitle: "当前最重要需求",
    themeNone: "暂时没有独有主题。",
    reportsCount: "份报告",
    reportPageLatest: "最新报告",
    reportPageArchive: "归档报告",
    rawMarkdown: "查看原始 Markdown",
    switchToEnglish: "English",
    switchToChinese: "中文",
    topFiveIssues: "条 issue",
    topFiveScore: "得分",
    repoCardIssues: "条 issue 已分析",
    repoCardClusters: "个需求簇",
    clusterIssues: "条 issue",
    clusterDemand: "需求得分",
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
  const compareHref = `${base}/${routeFor(uiLang, "compare/index.html")}`;
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
            <a href="${compareHref}">${t.navCompare}</a>
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

function shortTitle(text: string, max = 52): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function formatRisingScore(value: number): string {
  return value === Infinity ? "NEW" : `${value.toFixed(1)}x`;
}

function titleCase(text: string): string {
  return text.replace(/\b\w/g, (match) => match.toUpperCase());
}

function listOrFallback(items: string[], fallback: string): string {
  return items.length > 0 ? items.map((item) => titleCase(item)).join(", ") : fallback;
}

function formatCompareProductNames(uiLang: UiLang, products: ProductSummaryCard[]): string {
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

function compareIntroCopy(uiLang: UiLang, products: ProductSummaryCard[]): string {
  const names = formatCompareProductNames(uiLang, products);
  if (!names) {
    return ui[uiLang].compareEmptyCopy;
  }

  return uiLang === "zh"
    ? `看看${names}用户这周关注点在哪里重叠、又在哪里分化。`
    : `See where ${names} users overlap and diverge this week.`;
}

function buildSignalCard(
  signal: {
    slug: string;
    productName: string;
    title: string;
    category: string;
    demandScore: number;
    volume: number;
  },
  uiLang: UiLang,
  href: string
): string {
  const t = ui[uiLang];

  return `<article class="cluster-card">
    <div class="cluster-meta"><span class="pill">${escapeHtml(signal.productName)}</span><span>${signal.volume} ${t.clusterIssues}</span><span>${signal.demandScore.toFixed(1)} ${t.clusterDemand}</span></div>
    <h3><a href="${href}">${escapeHtml(signal.title)}</a></h3>
    <p>${escapeHtml(signal.category)}</p>
  </article>`;
}

function readCrossProductSummary(paths: SitePaths): CrossProductSummary | null {
  return readJson<CrossProductSummary>(resolve(paths.reportsDir, "latest", "cross-product.json"));
}

function getVisibleProducts(
  summary: CrossProductSummary | null,
  latestEntries: SiteReportEntry[],
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

function topFiveRow(cluster: NeedCluster, index: number, uiLang: UiLang): string {
  const t = ui[uiLang];
  return `<li class="top-five-item">
    <div class="top-five-rank">${index + 1}</div>
    <div class="top-five-body">
      <div class="top-five-main">
        <h3>${escapeHtml(cluster.title)}</h3>
        <span class="pill">${escapeHtml(cluster.category)}</span>
      </div>
      <p>${escapeHtml(cluster.summary)}</p>
      <div class="top-five-meta">
        <span>${cluster.volume} ${t.topFiveIssues}</span>
        <span>${cluster.demand_score.toFixed(1)} ${t.topFiveScore}</span>
      </div>
    </div>
  </li>`;
}

function buildHomePage(uiLang: UiLang, defaultEntry: SiteReportEntry, latestEntries: SiteReportEntry[], archiveWeeks: Map<string, SiteReportEntry[]>): string {
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

function buildObservatoryHomePage(
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

  const productCards = visibleProducts
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
          <a href="./products/${product.slug}.html">${escapeHtml(product.displayName)}</a>
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

function buildComparePage(
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

function buildProductPage(uiLang: UiLang, product: ProductSummaryCard): string {
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

    for (const product of visibleProducts) {
      writeText(
        absoluteSitePath(paths.siteDir, routeFor(uiLang, `products/${product.slug}.html`)),
        buildProductPage(uiLang, product)
      );
    }
  }

  console.log(`Site generated at ${paths.siteDir}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  buildSite();
}
