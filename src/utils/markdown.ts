import type { NeedCluster } from "../models/cluster.js";

export type Lang = "en" | "zh";

const i18n = {
  en: {
    rank: "Rank",
    need: "Need",
    issues: "Issues",
    score: "Score",
    category: "Category",
    examples: "Examples",
    risingScore: "Rising Score",
    thisWeek: "This Week",
    new: "NEW",
  },
  zh: {
    rank: "排名",
    need: "需求",
    issues: "Issue 数",
    score: "得分",
    category: "分类",
    examples: "示例",
    risingScore: "上升倍率",
    thisWeek: "本周",
    new: "新增",
  },
} as const;

export function markdownTable(
  headers: string[],
  rows: string[][]
): string {
  const headerLine = `| ${headers.join(" | ")} |`;
  const separatorLine = `| ${headers.map(() => "---").join(" | ")} |`;
  const dataLines = rows.map((row) => `| ${row.join(" | ")} |`);
  return [headerLine, separatorLine, ...dataLines].join("\n");
}

export function clusterToTableRow(
  cluster: NeedCluster,
  rank: number
): string[] {
  const issueLinks = cluster.issue_urls
    .slice(0, 3)
    .map((url) => {
      const num = url.split("/").pop();
      return `[#${num}](${url})`;
    })
    .join(", ");

  return [
    String(rank),
    cluster.title,
    String(cluster.volume),
    cluster.demand_score.toFixed(1),
    cluster.category,
    issueLinks,
  ];
}

export function generateRankingTable(clusters: NeedCluster[], limit = 10, lang: Lang = "en"): string {
  const t = i18n[lang];
  const headers = [t.rank, t.need, t.issues, t.score, t.category, t.examples];
  const rows = clusters
    .slice(0, limit)
    .map((c, i) => clusterToTableRow(c, i + 1));
  return markdownTable(headers, rows);
}

export function generateRisingTable(clusters: NeedCluster[], limit = 5, lang: Lang = "en"): string {
  const t = i18n[lang];
  const headers = [t.need, t.risingScore, t.thisWeek, t.category];
  const rows = clusters.slice(0, limit).map((c) => [
    c.title,
    c.rising_score === Infinity ? t.new : `${c.rising_score.toFixed(1)}x`,
    String(c.volume),
    c.category,
  ]);
  return markdownTable(headers, rows);
}

export function getWeekString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const dayOfYear = Math.floor(
    (date.getTime() - startOfYear.getTime()) / 86400000
  );
  const weekNumber = Math.ceil((dayOfYear + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(weekNumber).padStart(2, "0")}`;
}
