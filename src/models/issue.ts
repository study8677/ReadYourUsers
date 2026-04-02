/** Raw issue as fetched from GitHub API, trimmed to relevant fields */
export interface RawIssue {
  id: number;
  number: number;
  title: string;
  body: string | null;
  state: "open" | "closed";
  labels: Array<{ name: string }>;
  reactions: {
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  user: {
    login: string;
    id: number;
  };
  html_url: string;
}

/** Metadata for a repo's issue cache */
export interface RepoCacheMeta {
  repo: string;
  etag: string | null;
  last_fetched: string;
  total_issues: number;
  oldest_created_at: string | null;
  newest_created_at: string | null;
}
