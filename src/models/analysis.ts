export type IssueType =
  | "bug_report"
  | "feature_request"
  | "improvement"
  | "question"
  | "documentation"
  | "performance"
  | "other";

export type SeverityHint = "critical" | "major" | "moderate" | "minor" | "cosmetic";

/** LLM-produced structured analysis for a single issue */
export interface IssueAnalysis {
  issue_number: number;
  issue_url: string;
  repo: string;

  issue_type: IssueType;
  normalized_need: string;
  module_tags: string[];
  user_intent: string;
  severity_hint: SeverityHint;
  confidence: number;
  should_include: boolean;

  // Pass-through metadata for scoring
  reactions_total: number;
  comments_count: number;
  created_at: string;
  state: "open" | "closed";
}

/** Cache tracking which issues have been analyzed */
export interface AnalysisCache {
  repo: string;
  last_analyzed: string;
  analyses: IssueAnalysis[];
  /** Map of issue_number -> updated_at for incremental processing */
  issue_versions: Record<number, string>;
}
