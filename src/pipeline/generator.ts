import { resolve } from "node:path";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { mkdirSync } from "node:fs";
import type { RepoAggregation } from "../models/cluster.js";
import { readJSON, writeJSON } from "../utils/cache.js";
import {
  repoSlug,
  type RepoConfig,
} from "../config/repos.js";
import type { CrossProductSummary } from "../models/site.js";
import { buildCrossProductSummary, buildCrossProductSummaryWithLlm } from "./cross-product.js";
import {
  generateRankingTable,
  generateRisingTable,
  getWeekString,
  type Lang,
} from "../utils/markdown.js";
import {
  PROJECT_GITHUB_URL,
  TOP_N_REPORT,
} from "../config/constants.js";
import { logger } from "../utils/logger.js";
import { buildEnglishReadme, buildChineseReadme } from "./readme-templates.js";

export interface GenerateOptions {
  repo: string;
  repoConfig: RepoConfig;
  repoConfigs: RepoConfig[];
  dataDir: string;
  outputDir: string;
  useLlmThemes?: boolean;
}

export interface GenerateResult {
  repo: string;
  reportPath: string;
  readmeUpdated: boolean;
}

export class MissingAggregatedDataError extends Error {
  readonly repo: string;
  readonly clustersPath: string;

  constructor(repo: string, clustersPath: string) {
    super(`No aggregated data found at ${clustersPath}. Run 'ryu aggregate ${repo}' first.`);
    this.name = "MissingAggregatedDataError";
    this.repo = repo;
    this.clustersPath = clustersPath;
  }
}

export async function writeCrossProductSummary(
  configs: RepoConfig[],
  dataDir: string,
  outputDir: string,
  useLlmThemes: boolean = false
): Promise<CrossProductSummary | null> {
  const inputs = configs
    .map((config) => {
      const aggregation = readJSON<RepoAggregation>(
        resolve(dataDir, "aggregated", repoSlug(config.repo), "clusters.json")
      );

      return aggregation ? { config, aggregation } : null;
    })
    .filter(
      (value): value is { config: RepoConfig; aggregation: RepoAggregation } =>
        value !== null
    );

  if (inputs.length === 0) {
    return null;
  }

  const summary = useLlmThemes
    ? await buildCrossProductSummaryWithLlm(inputs)
    : buildCrossProductSummary(inputs);
  writeJSON(resolve(outputDir, "latest", "cross-product.json"), summary);
  return summary;
}

export async function generateReports(
  options: GenerateOptions
): Promise<GenerateResult> {
  const { repo, repoConfig, repoConfigs, dataDir, outputDir } = options;

  const slug = repoSlug(repo);
  const clustersPath = resolve(dataDir, "aggregated", slug, "clusters.json");

  const aggregation = readJSON<RepoAggregation>(clustersPath);
  if (!aggregation || aggregation.clusters.length === 0) {
    throw new MissingAggregatedDataError(repo, clustersPath);
  }

  const week = getWeekString();
  const now = new Date();

  const byDemand = [...aggregation.clusters].sort(
    (a, b) => b.demand_score - a.demand_score
  );
  const byRising = [...aggregation.clusters]
    .filter((c) => c.rising_score > 1)
    .sort((a, b) => b.rising_score - a.rising_score);

  // Generate both English and Chinese reports
  for (const lang of ["en", "zh"] as Lang[]) {
    const report = generateWeeklyReportMd(aggregation, repoConfig, byDemand, byRising, week, now, lang);
    const suffix = lang === "zh" ? ".zh" : "";

    const latestDir = resolve(outputDir, "latest");
    mkdirSync(latestDir, { recursive: true });
    const latestPath = resolve(latestDir, `${slug}${suffix}.md`);
    writeFileSync(latestPath, report, "utf-8");

    const archiveDir = resolve(outputDir, "archive", week);
    mkdirSync(archiveDir, { recursive: true });
    const archivePath = resolve(archiveDir, `${slug}${suffix}.md`);
    writeFileSync(archivePath, report, "utf-8");

    logger.info(`${lang.toUpperCase()} report written to ${latestPath}`);
  }

  const readmeUpdated = updateReadme(
    repo,
    repoConfig,
    aggregation,
    byDemand,
    byRising,
    now
  );

  await writeCrossProductSummary(repoConfigs, dataDir, outputDir, options.useLlmThemes ?? false);

  return {
    repo,
    reportPath: resolve(outputDir, "latest", `${slug}.md`),
    readmeUpdated,
  };
}

// =====================================================
// i18n labels
// =====================================================
const labels = {
  en: {
    reportTitle: (name: string) => `${name} — User Demand Report`,
    week: "Week",
    generated: "Generated",
    issuesAnalyzed: "Issues analyzed",
    included: "included",
    needClusters: "Need clusters",
    topNeeds: "Top 10 User Needs",
    risingNeeds: "Rising Needs",
    categoryBreakdown: "Category Breakdown",
    clusters: "clusters",
    allClusters: "All Need Clusters",
    volume: "Volume",
    issues: "issues",
    open: "open",
    closed: "closed",
    demandScore: "Demand Score",
    avgReactions: "Avg Reactions",
    avgComments: "Avg Comments",
    exampleIssues: "Example issues",
    footer:
      "*This report analyzes public GitHub issues only. It represents a signal from public issue discussions, not the full user base.*",
    generatedBy: `*Generated by [ReadYourUsers](${PROJECT_GITHUB_URL})*`,
  },
  zh: {
    reportTitle: (name: string) => `${name} — 用户需求报告`,
    week: "周",
    generated: "生成日期",
    issuesAnalyzed: "分析 Issue 数",
    included: "纳入分析",
    needClusters: "需求簇",
    topNeeds: "Top 10 用户需求",
    risingNeeds: "上升最快的需求",
    categoryBreakdown: "分类分布",
    clusters: "个簇",
    allClusters: "所有需求簇",
    volume: "数量",
    issues: "条 issue",
    open: "未关闭",
    closed: "已关闭",
    demandScore: "需求得分",
    avgReactions: "平均反应",
    avgComments: "平均评论",
    exampleIssues: "示例 Issue",
    footer:
      "*本报告仅分析公开 GitHub Issues，代表的是公开讨论中的需求信号，并非全部用户的声音。*",
    generatedBy: `*由 [ReadYourUsers](${PROJECT_GITHUB_URL}) 生成*`,
  },
} as const;

function generateWeeklyReportMd(
  aggregation: RepoAggregation,
  repoConfig: RepoConfig,
  byDemand: RepoAggregation["clusters"],
  byRising: RepoAggregation["clusters"],
  week: string,
  now: Date,
  lang: Lang
): string {
  const t = labels[lang];
  const lines: string[] = [];

  lines.push(`# ${t.reportTitle(repoConfig.display_name)}`);
  lines.push("");
  lines.push(`**${t.week}:** ${week}`);
  lines.push(`**${t.generated}:** ${now.toISOString().slice(0, 10)}`);
  lines.push(
    `**${t.issuesAnalyzed}:** ${aggregation.total_issues_analyzed} (${aggregation.total_issues_included} ${t.included})`
  );
  lines.push(`**${t.needClusters}:** ${aggregation.clusters.length}`);
  lines.push("");

  lines.push(`## ${t.topNeeds}`);
  lines.push("");
  lines.push(generateRankingTable(byDemand, TOP_N_REPORT, lang));
  lines.push("");

  if (byRising.length > 0) {
    lines.push(`## ${t.risingNeeds}`);
    lines.push("");
    lines.push(generateRisingTable(byRising, 5, lang));
    lines.push("");
  }

  lines.push(`## ${t.categoryBreakdown}`);
  lines.push("");
  const categories = Object.entries(aggregation.category_breakdown)
    .sort((a, b) => b[1] - a[1]);
  for (const [cat, count] of categories) {
    lines.push(`- **${cat}**: ${count} ${t.clusters}`);
  }
  lines.push("");

  lines.push(`## ${t.allClusters}`);
  lines.push("");
  for (let i = 0; i < byDemand.length; i++) {
    const c = byDemand[i];
    lines.push(`### ${i + 1}. ${c.title}`);
    lines.push("");
    lines.push(c.summary);
    lines.push("");
    lines.push(
      `- **${t.volume}:** ${c.volume} ${t.issues} (${c.open_count} ${t.open}, ${c.closed_count} ${t.closed})`
    );
    lines.push(`- **${t.demandScore}:** ${c.demand_score.toFixed(1)}`);
    lines.push(
      `- **${t.avgReactions}:** ${c.avg_reactions} | **${t.avgComments}:** ${c.avg_comments}`
    );

    const issueLinks = c.issue_urls
      .slice(0, 5)
      .map((url) => {
        const num = url.split("/").pop();
        return `[#${num}](${url})`;
      })
      .join(", ");
    lines.push(`- **${t.exampleIssues}:** ${issueLinks}`);
    lines.push("");
  }

  lines.push("---");
  lines.push("");
  lines.push(t.footer);
  lines.push("");
  lines.push(t.generatedBy);

  return lines.join("\n");
}

function updateReadme(
  repo: string,
  repoConfig: RepoConfig,
  aggregation: RepoAggregation,
  byDemand: RepoAggregation["clusters"],
  byRising: RepoAggregation["clusters"],
  now: Date
): boolean {
  const slug = repoSlug(repo);
  const marker = {
    start: "<!-- READYOURUSERS:START -->",
    end: "<!-- READYOURUSERS:END -->",
  };

  // ===================== English README.md =====================
  writeReadmeFile(
    resolve(process.cwd(), "README.md"),
    marker,
    buildEnglishReadme(repo, repoConfig, slug, aggregation, byDemand, byRising, now)
  );

  // ===================== Chinese README.zh.md =====================
  writeReadmeFile(
    resolve(process.cwd(), "README.zh.md"),
    marker,
    buildChineseReadme(repo, repoConfig, slug, aggregation, byDemand, byRising, now)
  );

  logger.info("README.md + README.zh.md updated");
  return true;
}

function writeReadmeFile(
  path: string,
  marker: { start: string; end: string },
  content: { section: string; fullPage: string }
): void {
  if (existsSync(path)) {
    let readme = readFileSync(path, "utf-8");
    const startIdx = readme.indexOf(marker.start);
    const endIdx = readme.indexOf(marker.end);
    if (startIdx !== -1 && endIdx !== -1) {
      readme =
        readme.slice(0, startIdx) +
        content.section +
        readme.slice(endIdx + marker.end.length);
    } else {
      readme += "\n\n" + content.section;
    }
    writeFileSync(path, readme, "utf-8");
  } else {
    writeFileSync(path, content.fullPage, "utf-8");
  }
}

