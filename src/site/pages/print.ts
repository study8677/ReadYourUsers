import { readFileSync } from "node:fs";
import type { ProductSummaryCard } from "../../models/site.js";
import type { UiLang } from "../i18n.js";
import { ui } from "../i18n.js";
import { escapeHtml, formatDate, markdownToHtml, type SiteReportEntry } from "../html.js";
import { PUBLIC_SITE_URL } from "../../config/constants.js";

// =====================================================
// Print CSS
// =====================================================

function printCss(lang: UiLang): string {
  const serifFont =
    lang === "zh"
      ? '"Songti SC", "Noto Serif SC", "Source Han Serif SC", "SimSun", serif'
      : '"Georgia", "Cambria", "Times New Roman", serif';
  const sansFont =
    lang === "zh"
      ? '"PingFang SC", "Microsoft YaHei", system-ui, sans-serif'
      : '"Inter", system-ui, -apple-system, sans-serif';

  return `
    @page {
      size: A4;
      margin: 20mm 18mm 24mm 18mm;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { font-size: 11pt; }

    body {
      font-family: ${serifFont};
      line-height: 1.7;
      color: #1a1a1a;
      background: #fff;
      max-width: 100%;
      padding: 0;
    }

    /* --- Header --- */
    .print-header {
      text-align: center;
      padding-bottom: 1.5em;
      margin-bottom: 1.5em;
      border-bottom: 2px solid #0f6fff;
    }
    .print-header h1 {
      font-family: ${sansFont};
      font-size: 22pt;
      font-weight: 700;
      color: #0f6fff;
      margin-bottom: 0.3em;
    }
    .print-header .print-subtitle {
      font-size: 13pt;
      color: #555;
      margin-bottom: 0.6em;
    }
    .print-meta {
      font-size: 9.5pt;
      color: #777;
      display: flex;
      justify-content: center;
      gap: 2em;
      flex-wrap: wrap;
    }

    /* --- Footer --- */
    .print-footer {
      margin-top: 2em;
      padding-top: 1em;
      border-top: 1px solid #ddd;
      text-align: center;
      font-size: 8.5pt;
      color: #999;
    }

    /* --- Headings --- */
    h1 { font-family: ${sansFont}; font-size: 20pt; font-weight: 700; color: #111; margin: 1em 0 0.4em; }
    h2 {
      font-family: ${sansFont};
      font-size: 15pt;
      font-weight: 600;
      color: #0f6fff;
      margin: 1.4em 0 0.5em;
      padding-top: 0.6em;
      border-top: 1px solid #e0e0e0;
      page-break-after: avoid;
    }
    h3 { font-family: ${sansFont}; font-size: 12pt; font-weight: 600; color: #333; margin: 1em 0 0.3em; page-break-after: avoid; }

    /* --- Body content --- */
    .print-body p { margin: 0.5em 0; }
    .print-body ul, .print-body ol { margin: 0.5em 0 0.5em 1.5em; }
    .print-body li { margin: 0.2em 0; }
    .print-body strong { color: #111; }

    /* --- Tables --- */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 0.8em 0;
      font-size: 9.5pt;
      page-break-inside: avoid;
      table-layout: fixed;
      word-wrap: break-word;
    }
    thead { background: #f0f4ff; }
    th {
      font-family: ${sansFont};
      font-weight: 600;
      text-align: left;
      padding: 6px 8px;
      border: 1px solid #ccc;
      color: #333;
      font-size: 9pt;
    }
    td {
      padding: 5px 8px;
      border: 1px solid #ddd;
      vertical-align: top;
    }
    tbody tr:nth-child(even) { background: #f9fafb; }

    /* --- Links --- */
    a { color: #0f6fff; text-decoration: none; }
    .print-body a[href^="http"]::after {
      content: " (" attr(href) ")";
      font-size: 0.8em;
      color: #888;
      word-break: break-all;
    }
    /* Short GitHub issue links — don't print full URL */
    .print-body a[href*="github.com"][href*="/issues/"]::after {
      content: "";
    }

    /* --- Code --- */
    code {
      font-family: "SF Mono", "Fira Code", "Consolas", monospace;
      font-size: 0.9em;
      background: #f5f5f5;
      padding: 1px 4px;
      border-radius: 3px;
    }
    pre {
      background: #f5f5f5;
      padding: 10px 12px;
      border-radius: 4px;
      overflow-x: auto;
      font-size: 9pt;
      margin: 0.8em 0;
      page-break-inside: avoid;
    }
    pre code { background: none; padding: 0; }

    /* --- Horizontal rule --- */
    hr {
      border: none;
      border-top: 1px solid #ddd;
      margin: 1.5em 0;
    }

    /* --- Product snapshot --- */
    .print-stats {
      display: flex;
      gap: 1.5em;
      margin: 1em 0;
      flex-wrap: wrap;
    }
    .print-stat {
      background: #f0f4ff;
      padding: 8px 14px;
      border-radius: 6px;
      font-size: 9.5pt;
    }
    .print-stat strong {
      display: block;
      font-family: ${sansFont};
      font-size: 16pt;
      color: #0f6fff;
    }

    .print-insight-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin: 1em 0;
    }
    .print-insight {
      background: #f9fafb;
      padding: 10px 12px;
      border-radius: 6px;
      border-left: 3px solid #0f6fff;
    }
    .print-insight-label {
      font-family: ${sansFont};
      font-size: 8pt;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #888;
      margin-bottom: 2px;
    }
    .print-insight h3 {
      font-size: 10.5pt;
      margin: 0;
      border: none;
      padding: 0;
    }

    .print-cluster-list { list-style: none; margin: 0; padding: 0; }
    .print-cluster-item {
      padding: 8px 0;
      border-bottom: 1px solid #eee;
      page-break-inside: avoid;
    }
    .print-cluster-rank {
      font-family: ${sansFont};
      font-size: 9pt;
      color: #0f6fff;
      font-weight: 700;
    }
    .print-cluster-title { font-weight: 600; }
    .print-cluster-meta { font-size: 8.5pt; color: #777; margin-top: 2px; }

    /* --- Page break helpers --- */
    .page-break { page-break-before: always; }

    /* --- Print-specific overrides --- */
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .print-header, .print-footer { position: static; }
    }

    /* --- Screen preview (when user views without printing) --- */
    @media screen {
      body { max-width: 800px; margin: 2em auto; padding: 0 1.5em; }
      .print-no-print { display: block; text-align: center; margin-bottom: 1.5em; }
      .print-no-print button {
        font-family: ${sansFont};
        font-size: 11pt;
        padding: 8px 24px;
        background: #0f6fff;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
    }
    @media print {
      .print-no-print { display: none; }
    }
  `;
}

// =====================================================
// Shell
// =====================================================

function printPageShell(lang: UiLang, title: string, bodyHtml: string): string {
  const htmlLang = lang === "zh" ? "zh-CN" : "en";
  const t = ui[lang];
  return `<!doctype html>
<html lang="${htmlLang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>${printCss(lang)}</style>
</head>
<body>
  <div class="print-no-print">
    <button onclick="window.print()">${t.downloadPdf}</button>
  </div>
  ${bodyHtml}
  <footer class="print-footer">
    <p>${t.printPoweredBy}</p>
    <p>${PUBLIC_SITE_URL}</p>
  </footer>
  <script>
    if (window.matchMedia("print").matches || /[?&]print=1/.test(location.search)) {
      window.print();
    } else {
      window.onafterprint = () => {};
      setTimeout(() => window.print(), 300);
    }
  </script>
</body>
</html>`;
}

// =====================================================
// Report print page (from markdown)
// =====================================================

export function buildReportPrintPage(uiLang: UiLang, entry: SiteReportEntry): string {
  const t = ui[uiLang];
  const markdown = readFileSync(entry.sourcePath, "utf-8");
  const html = markdownToHtml(markdown);

  const meta = entry.aggregation;
  const metaParts = [
    meta ? `${t.printGenerated}: ${formatDate(meta.generated_at)}` : "",
    meta ? `${t.printIssuesAnalyzed}: ${meta.total_issues_analyzed} (${meta.total_issues_included} ${t.printIncluded})` : "",
    meta ? `${t.printClusters}: ${meta.clusters.length}` : "",
  ].filter(Boolean);

  const bodyHtml = `
    <header class="print-header">
      <h1>${escapeHtml(entry.displayName)}</h1>
      <p class="print-subtitle">${t.printTitle}</p>
      <div class="print-meta">
        ${metaParts.map((p) => `<span>${p}</span>`).join("")}
      </div>
    </header>
    <article class="print-body">
      ${html}
    </article>`;

  return printPageShell(uiLang, `${entry.displayName} — ${t.printTitle}`, bodyHtml);
}

// =====================================================
// Product print page (from structured data)
// =====================================================

function formatRisingScore(value: number): string {
  return value === Infinity ? "NEW" : `${value.toFixed(1)}x`;
}

export function buildProductPrintPage(uiLang: UiLang, product: ProductSummaryCard): string {
  const t = ui[uiLang];
  const topClusters = [...product.aggregation.clusters]
    .sort((a, b) => b.demand_score - a.demand_score)
    .slice(0, 10);

  const topNeed = product.topNeed;
  const risingNeed = product.risingNeed;

  const clusterRows = topClusters
    .map(
      (c, i) => `<li class="print-cluster-item">
        <span class="print-cluster-rank">#${i + 1}</span>
        <span class="print-cluster-title">${escapeHtml(c.title)}</span>
        <div class="print-cluster-meta">
          ${c.volume} ${t.clusterIssues} · ${c.demand_score.toFixed(1)} ${t.clusterDemand} · ${escapeHtml(c.category)}
        </div>
        <div style="font-size:9pt;color:#555;margin-top:2px;">${escapeHtml(c.summary)}</div>
      </li>`
    )
    .join("\n");

  const bodyHtml = `
    <header class="print-header">
      <h1>${escapeHtml(product.displayName)}</h1>
      <p class="print-subtitle">${t.printProductSnapshot}</p>
      <div class="print-meta">
        <span>${t.printGenerated}: ${formatDate(product.generatedAt)}</span>
        <span>${t.printIssuesAnalyzed}: ${product.totalIssuesAnalyzed}</span>
        <span>${t.printClusters}: ${product.totalClusters}</span>
      </div>
    </header>

    <div class="print-stats">
      <div class="print-stat"><strong>${product.totalIssuesAnalyzed}</strong>${t.statsIssues}</div>
      <div class="print-stat"><strong>${product.totalIssuesIncluded}</strong>${t.statsIncluded}</div>
      <div class="print-stat"><strong>${product.totalClusters}</strong>${t.statsClusters}</div>
      <div class="print-stat"><strong>${formatDate(product.generatedAt)}</strong>${t.statsUpdated}</div>
    </div>

    <div class="print-insight-grid">
      <div class="print-insight">
        <div class="print-insight-label">${t.printTopNeed}</div>
        <h3>${escapeHtml(topNeed?.title ?? "—")}</h3>
      </div>
      <div class="print-insight">
        <div class="print-insight-label">${t.printRisingNeed}</div>
        <h3>${escapeHtml(risingNeed?.title ?? "—")}</h3>
        ${risingNeed ? `<div style="font-size:9pt;color:#0f6fff;">${formatRisingScore(risingNeed.rising_score)}</div>` : ""}
      </div>
      <div class="print-insight">
        <div class="print-insight-label">${t.printDominantCategory}</div>
        <h3>${escapeHtml(product.dominantCategory ?? "—")}</h3>
      </div>
    </div>

    <h2>${t.printTopNeeds}</h2>
    <ol class="print-cluster-list">
      ${clusterRows}
    </ol>`;

  return printPageShell(uiLang, `${product.displayName} — ${t.printProductSnapshot}`, bodyHtml);
}
