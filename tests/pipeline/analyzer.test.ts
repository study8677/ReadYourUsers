import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { writeJSON, readJSON } from "../../src/utils/cache.js";
import type { RawIssue } from "../../src/models/issue.js";
import type { AnalysisCache } from "../../src/models/analysis.js";

const mockIssues: RawIssue[] = [
  {
    id: 1,
    number: 1,
    title: "CLI crashes on startup",
    body: "The CLI crashes when I run it",
    state: "open",
    labels: [{ name: "bug" }],
    reactions: { total_count: 5, "+1": 3, "-1": 0, laugh: 0, hooray: 0, confused: 0, heart: 1, rocket: 1, eyes: 0 },
    comments: 2,
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-02T00:00:00Z",
    closed_at: null,
    user: { login: "testuser", id: 123 },
    html_url: "https://github.com/test/test/issues/1",
  },
];

describe("analyzeIssues", () => {
  let dataDir: string;

  beforeEach(() => {
    dataDir = mkdtempSync(resolve(tmpdir(), "ryu-analyzer-"));
    writeJSON(resolve(dataDir, "raw", "test-test", "issues.json"), mockIssues);
  });

  afterEach(() => {
    vi.doUnmock("../../src/llm/client.js");
    vi.resetModules();
    try { rmSync(dataDir, { recursive: true }); } catch {}
  });

  it("analyzes issues and writes cache", async () => {
    vi.doMock("../../src/llm/client.js", () => ({
      callStructured: vi.fn().mockResolvedValue({
        issue_type: "bug_report",
        normalized_need: "Fix CLI startup crashes",
        module_tags: ["cli"],
        user_intent: "Start the CLI without crashes",
        severity_hint: "major",
        confidence: 0.95,
        should_include: true,
      }),
    }));

    const { analyzeIssues } = await import("../../src/pipeline/analyzer.js");
    const result = await analyzeIssues({
      repo: "test/test",
      dataDir,
    });

    expect(result.repo).toBe("test/test");
    expect(result.totalAnalyzed).toBe(1);
    expect(result.newAnalyses).toBe(1);
    expect(result.errors).toBe(0);

    const cache = readJSON<AnalysisCache>(
      resolve(dataDir, "analyzed", "test-test", "analyses.json")
    );
    expect(cache?.analyses).toHaveLength(1);
    expect(cache?.analyses[0].normalized_need).toBe("Fix CLI startup crashes");
  });

  it("reports errors without crashing when LLM fails", async () => {
    vi.doMock("../../src/llm/client.js", () => ({
      callStructured: vi.fn().mockRejectedValue(new Error("LLM unavailable")),
    }));

    const { analyzeIssues } = await import("../../src/pipeline/analyzer.js");
    const result = await analyzeIssues({
      repo: "test/test",
      dataDir,
    });

    expect(result.errors).toBe(1);
    expect(result.newAnalyses).toBe(0);
  });

  it("skips already-analyzed issues", async () => {
    const callSpy = vi.fn().mockResolvedValue({
      issue_type: "bug_report",
      normalized_need: "Fix CLI startup crashes",
      module_tags: ["cli"],
      user_intent: "Start the CLI without crashes",
      severity_hint: "major",
      confidence: 0.95,
      should_include: true,
    });

    vi.doMock("../../src/llm/client.js", () => ({
      callStructured: callSpy,
    }));

    const { analyzeIssues } = await import("../../src/pipeline/analyzer.js");

    // First run
    await analyzeIssues({ repo: "test/test", dataDir });
    expect(callSpy).toHaveBeenCalledTimes(1);

    callSpy.mockClear();

    // Reset modules to pick up the cache
    vi.resetModules();
    vi.doMock("../../src/llm/client.js", () => ({
      callStructured: callSpy,
    }));
    const mod2 = await import("../../src/pipeline/analyzer.js");

    // Second run — should skip
    const result = await mod2.analyzeIssues({ repo: "test/test", dataDir });
    expect(result.skipped).toBe(1);
    expect(callSpy).toHaveBeenCalledTimes(0);
  });
});
