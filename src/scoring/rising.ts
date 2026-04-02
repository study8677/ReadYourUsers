import type { IssueAnalysis } from "../models/analysis.js";

/**
 * Compute rising score: smoothed week-over-week issue count ratio.
 * Uses Laplace smoothing to handle zero-division.
 */
export function computeRisingScore(
  analyses: IssueAnalysis[],
  now: Date = new Date()
): number {
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  let currentWeek = 0;
  let previousWeek = 0;

  for (const a of analyses) {
    const created = new Date(a.created_at);
    if (created >= oneWeekAgo) {
      currentWeek++;
    } else if (created >= twoWeeksAgo) {
      previousWeek++;
    }
  }

  // Laplace smoothing
  return (currentWeek + 1) / (previousWeek + 1);
}
