import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { readJSON } from "../../src/utils/cache.js";
import type { RawIssue, RepoCacheMeta } from "../../src/models/issue.js";

const mockIssues = [
  {
    id: 1,
    number: 1,
    title: "Test issue",
    body: "Test body",
    state: "open",
    labels: [{ name: "bug" }],
    reactions: { total_count: 5, "+1": 3, "-1": 0, laugh: 0, hooray: 0, confused: 0, heart: 1, rocket: 1, eyes: 0 },
    comments: 2,
    created_at: "2026-04-01T00:00:00Z",
    updated_at: "2026-04-02T00:00:00Z",
    closed_at: null,
    user: { login: "testuser", id: 123 },
    html_url: "https://github.com/test/test/issues/1",
    pull_request: undefined,
  },
];

describe("fetchIssues", () => {
  let dataDir: string;

  beforeEach(() => {
    dataDir = mkdtempSync(resolve(tmpdir(), "ryu-fetcher-"));
    vi.stubEnv("READYOURUSERS_GITHUB_TOKEN", "ghp_test");
  });

  afterEach(() => {
    vi.doUnmock("@octokit/rest");
    vi.doUnmock("@octokit/plugin-throttling");
    vi.resetModules();
    vi.unstubAllEnvs();
    try { rmSync(dataDir, { recursive: true }); } catch {}
  });

  it("fetches issues and writes cache", async () => {
    vi.doMock("@octokit/rest", () => ({
      Octokit: class {
        static plugin() { return this; }
        issues = {
          listForRepo: vi.fn().mockResolvedValue({
            data: mockIssues,
            headers: { etag: '"abc123"' },
          }),
        };
      },
    }));
    vi.doMock("@octokit/plugin-throttling", () => ({
      throttling: () => {},
    }));

    const { fetchIssues } = await import("../../src/pipeline/fetcher.js");
    const result = await fetchIssues({
      repo: "test/test",
      dataDir,
      maxPages: 1,
    });

    expect(result.repo).toBe("test/test");
    expect(result.totalFetched).toBe(1);
    expect(result.newIssues).toBe(1);

    const cached = readJSON<RawIssue[]>(resolve(dataDir, "raw", "test-test", "issues.json"));
    expect(cached).toHaveLength(1);
    expect(cached?.[0].title).toBe("Test issue");
  });
});
