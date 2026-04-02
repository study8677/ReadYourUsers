import type { NeedCluster } from "../models/cluster.js";

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

export function generateRankingTable(clusters: NeedCluster[], limit = 10): string {
  const headers = ["Rank", "Need", "Issues", "Score", "Category", "Examples"];
  const rows = clusters
    .slice(0, limit)
    .map((c, i) => clusterToTableRow(c, i + 1));
  return markdownTable(headers, rows);
}

export function generateRisingTable(clusters: NeedCluster[], limit = 5): string {
  const headers = ["Need", "Rising Score", "This Week", "Category"];
  const rows = clusters.slice(0, limit).map((c) => [
    c.title,
    c.rising_score === Infinity ? "NEW" : `${c.rising_score.toFixed(1)}x`,
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
