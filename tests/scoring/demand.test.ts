import { describe, expect, it } from "vitest";
import { computeDemandScore } from "../../src/scoring/demand.js";
import type { IssueAnalysis } from "../../src/models/analysis.js";

function makeAnalysis(overrides: Partial<IssueAnalysis> = {}): IssueAnalysis {
  return {
    issue_number: 1,
    issue_url: "https://github.com/test/test/issues/1",
    repo: "test/test",
    issue_type: "feature_request",
    normalized_need: "Test need",
    module_tags: ["cli"],
    user_intent: "Test intent",
    severity_hint: "moderate",
    confidence: 0.9,
    should_include: true,
    reactions_total: 5,
    comments_count: 3,
    created_at: new Date().toISOString(),
    state: "open",
    ...overrides,
  };
}

describe("computeDemandScore", () => {
  it("returns 0 for empty analyses", () => {
    expect(computeDemandScore({ analyses: [], reposAffected: 1 })).toBe(0);
  });

  it("returns positive score for valid analyses", () => {
    const score = computeDemandScore({
      analyses: [makeAnalysis()],
      reposAffected: 1,
      now: new Date(),
    });
    expect(score).toBeGreaterThan(0);
  });

  it("increases with more repos affected (cross-repo weight)", () => {
    const analyses = [makeAnalysis()];
    const single = computeDemandScore({ analyses, reposAffected: 1 });
    const multi = computeDemandScore({ analyses, reposAffected: 3 });
    expect(multi).toBeGreaterThan(single);
  });

  it("older issues have lower recency weight", () => {
    const now = new Date();
    const recent = makeAnalysis({ created_at: now.toISOString() });
    const old = makeAnalysis({
      created_at: new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const recentScore = computeDemandScore({ analyses: [recent], reposAffected: 1, now });
    const oldScore = computeDemandScore({ analyses: [old], reposAffected: 1, now });
    expect(recentScore).toBeGreaterThan(oldScore);
  });

  it("higher engagement increases score", () => {
    const now = new Date();
    const low = makeAnalysis({ reactions_total: 0, comments_count: 0, created_at: now.toISOString() });
    const high = makeAnalysis({ reactions_total: 20, comments_count: 10, created_at: now.toISOString() });
    const lowScore = computeDemandScore({ analyses: [low, low], reposAffected: 1, now });
    const highScore = computeDemandScore({ analyses: [high, high], reposAffected: 1, now });
    expect(highScore).toBeGreaterThan(lowScore);
  });

  it("uses globalMaxEngagement when provided for fair cross-cluster comparison", () => {
    const now = new Date();
    const highEngagement = makeAnalysis({ reactions_total: 100, comments_count: 50, created_at: now.toISOString() });
    const lowEngagement = makeAnalysis({ reactions_total: 2, comments_count: 1, created_at: now.toISOString() });

    // Without global max, the low-engagement cluster normalizes against itself
    const withoutGlobal = computeDemandScore({
      analyses: [lowEngagement],
      reposAffected: 1,
      now,
    });

    // With global max from the high-engagement cluster, relative score drops
    const withGlobal = computeDemandScore({
      analyses: [lowEngagement],
      reposAffected: 1,
      now,
      globalMaxEngagement: 100 + 50 * 2, // = 200
    });

    expect(withGlobal).toBeLessThan(withoutGlobal);
  });
});
