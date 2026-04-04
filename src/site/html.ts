import type { NeedCluster } from "../models/cluster.js";
import type { ProductSummaryCard } from "../models/site.js";
import { PROJECT_GITHUB_URL } from "../config/constants.js";
import { ui, type UiLang } from "./i18n.js";

export type ReportLang = "en" | "zh";

export interface SiteReportEntry {
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
  aggregation?: import("../models/cluster.js").RepoAggregation;
}

export interface SitePaths {
  rootDir: string;
  reportsDir: string;
  dataDir: string;
  siteDir: string;
}

export function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function formatDate(value: string | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export function prefix(depth: number): string {
  return depth === 0 ? "." : Array.from({ length: depth }, () => "..").join("/");
}

export function routeFor(uiLang: UiLang, path: string): string {
  return `${uiLang}/${path}`;
}

export function applyInlineMarkdown(text: string): string {
  let html = escapeHtml(text);
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return html;
}

export function markdownToHtml(markdown: string): string {
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

export function pageTemplate(params: {
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
  const toolsHref = `${base}/${routeFor(uiLang, "tools/index.html")}`;
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
            <a href="${toolsHref}">${t.navTools}</a>
            <a href="${PROJECT_GITHUB_URL}">${t.navGitHub}</a>
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

export function shortTitle(text: string, max = 52): string {
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

export function formatRisingScore(value: number): string {
  return value === Infinity ? "NEW" : `${value.toFixed(1)}x`;
}

export function titleCase(text: string): string {
  return text.replace(/\b\w/g, (match) => match.toUpperCase());
}

export function listOrFallback(items: string[], fallback: string): string {
  return items.length > 0 ? items.map((item) => titleCase(item)).join(", ") : fallback;
}

export function buildClusterCard(cluster: NeedCluster, uiLang: UiLang): string {
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

export function buildSignalCard(
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

export function topFiveRow(cluster: NeedCluster, index: number, uiLang: UiLang): string {
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
