import type { IssueAnalysis } from "../models/analysis.js";
import { RECENCY_HALF_LIFE_DAYS } from "../config/constants.js";

/** Compute recency weight for a single issue (exponential decay) */
function issueRecency(createdAt: string, now: Date): number {
  const created = new Date(createdAt);
  const daysSince = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
  // Exponential decay: exp(-daysSince / halfLife * ln(2))
  return Math.exp((-daysSince * Math.LN2) / RECENCY_HALF_LIFE_DAYS);
}

/** Compute engagement score for a single issue, normalized 0-1 */
function issueEngagement(
  reactions: number,
  comments: number,
  maxEngagement: number
): number {
  if (maxEngagement === 0) return 0;
  const raw = reactions + comments * 2;
  return raw / maxEngagement;
}

export interface DemandScoreInput {
  analyses: IssueAnalysis[];
  reposAffected: number;
  now?: Date;
  /** If provided, use this for engagement normalization instead of per-cluster max */
  globalMaxEngagement?: number;
}

export function computeDemandScore(input: DemandScoreInput): number {
  const { analyses, reposAffected, now = new Date() } = input;

  if (analyses.length === 0) return 0;

  const volume = analyses.length;

  // Find max engagement for normalization
  const maxEngagement = input.globalMaxEngagement ?? Math.max(
    ...analyses.map((a) => a.reactions_total + a.comments_count * 2),
    1
  );

  const recency =
    analyses.reduce((sum, a) => sum + issueRecency(a.created_at, now), 0) /
    analyses.length;

  const engagement =
    analyses.reduce(
      (sum, a) =>
        sum + issueEngagement(a.reactions_total, a.comments_count, maxEngagement),
      0
    ) / analyses.length;

  const crossRepoWeight = 1.0 + 0.5 * (reposAffected - 1);

  return volume * recency * engagement * crossRepoWeight;
}
