import type { NeedCluster } from "./cluster.js";

export interface WeeklyReport {
  repo: string;
  display_name: string;
  week: string;
  generated_at: string;
  top_needs: NeedCluster[];
  rising_needs: NeedCluster[];
  new_this_week: NeedCluster[];
  stats: {
    total_issues_analyzed: number;
    new_issues_this_week: number;
    total_clusters: number;
  };
}

export interface CrossProjectReport {
  week: string;
  generated_at: string;
  repos: string[];
  shared_needs: NeedCluster[];
  unique_needs: Record<string, NeedCluster[]>;
}
