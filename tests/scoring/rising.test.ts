import { describe, expect, it } from "vitest";
import { computeRisingScore } from "../../src/scoring/rising.js";
import type { IssueAnalysis } from "../../src/models/analysis.js";

function makeAnalysis(daysAgo: number, now: Date): IssueAnalysis {
  const created = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return {
    issue_number: 1,
    issue_url: "https://github.com/test/test/issues/1",
    repo: "test/test",
    issue_type: "feature_request",
    normalized_need: "Test",
    module_tags: ["cli"],
    user_intent: "Test",
    severity_hint: "moderate",
    confidence: 0.9,
    should_include: true,
    reactions_total: 0,
    comments_count: 0,
    created_at: created.toISOString(),
    state: "open",
  };
}

describe("computeRisingScore", () => {
  it("returns 1 when no issues in either week", () => {
    const now = new Date();
    expect(computeRisingScore([], now)).toBe(1);
  });

  it("returns > 1 when current week has more issues than previous", () => {
    const now = new Date();
    const analyses = [
      makeAnalysis(1, now), // current week
      makeAnalysis(2, now), // current week
      makeAnalysis(10, now), // previous week
    ];
    expect(computeRisingScore(analyses, now)).toBeGreaterThan(1);
  });

  it("returns < 1 when previous week had more issues", () => {
    const now = new Date();
    const analyses = [
      makeAnalysis(1, now), // current week
      makeAnalysis(10, now), // previous week
      makeAnalysis(11, now), // previous week
      makeAnalysis(12, now), // previous week
    ];
    expect(computeRisingScore(analyses, now)).toBeLessThan(1);
  });

  it("uses Laplace smoothing to avoid division by zero", () => {
    const now = new Date();
    const analyses = [makeAnalysis(1, now), makeAnalysis(2, now)];
    const score = computeRisingScore(analyses, now);
    // (2+1)/(0+1) = 3
    expect(score).toBe(3);
  });
});
