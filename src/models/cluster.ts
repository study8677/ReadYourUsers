/** A cluster of related user needs */
export interface NeedCluster {
  cluster_id: string;
  title: string;
  summary: string;
  category: string;
  representative_need: string;

  issue_numbers: number[];
  issue_urls: string[];
  sample_titles: string[];

  demand_score: number;
  rising_score: number;

  volume: number;
  open_count: number;
  closed_count: number;
  avg_reactions: number;
  avg_comments: number;
  date_first_seen: string;
  date_last_seen: string;

  repos_affected: string[];
}

/** Top-level aggregation result for one repo */
export interface RepoAggregation {
  repo: string;
  display_name: string;
  generated_at: string;
  window_start: string;
  window_end: string;
  total_issues_analyzed: number;
  total_issues_included: number;
  clusters: NeedCluster[];
  category_breakdown: Record<string, number>;
}
