export const ISSUE_ANALYSIS_SYSTEM_PROMPT = `You are an expert product analyst specializing in developer tools. Your task is to analyze a single GitHub issue and extract structured information about the user's underlying need.

Guidelines:
- Focus on the UNDERLYING NEED, not the specific implementation suggestion
- Write normalized_need in imperative form: "Support X", "Fix Y", "Add Z"
- Be specific enough to be meaningful but general enough to cluster with similar issues
- module_tags should reflect functional areas (e.g., "cli", "auth", "performance", "configuration", "editor", "terminal", "mcp", "git")
- Set should_include=false for: spam, off-topic, pure "me too" with no added context, support questions that don't reveal a generalizable need, or automated bot posts
- severity_hint: critical=data loss/security, major=blocks workflow, moderate=significant inconvenience, minor=nice-to-have, cosmetic=visual/formatting
- confidence: 1.0 if title+body are clear; lower if ambiguous, non-English, or very short`;

export function buildIssueAnalysisUserPrompt(issue: {
  title: string;
  body: string | null;
  labels: string[];
  comments: number;
  state: string;
  created_at: string;
  repo: string;
}): string {
  const labels = issue.labels.length > 0 ? issue.labels.join(", ") : "none";
  const body = issue.body
    ? issue.body.slice(0, 3000) // Truncate very long bodies
    : "(no body)";

  return `Analyze this GitHub issue from ${issue.repo}:

Title: ${issue.title}
State: ${issue.state}
Labels: ${labels}
Comments: ${issue.comments}
Created: ${issue.created_at}

Body:
${body}`;
}

export const CLUSTER_SUMMARY_SYSTEM_PROMPT = `You are an expert product analyst. Given a group of related user needs from GitHub issues, generate a concise cluster title, summary, and category.

Guidelines:
- The title should be a clear, descriptive phrase (5-10 words) that captures the shared theme
- The summary should explain what users want and why in 2-3 sentences
- The category should be a broad grouping like: Developer Experience, Performance, Configuration, Integration, Documentation, Security, Reliability, UI/UX, Platform Support`;

export function buildClusterSummaryPrompt(
  needs: string[],
  sampleTitles: string[]
): string {
  const needsList = needs.map((n) => `- ${n}`).join("\n");
  const titlesList = sampleTitles.slice(0, 5).map((t) => `- ${t}`).join("\n");

  return `Here are ${needs.length} related user needs from GitHub issues:

Normalized needs:
${needsList}

Sample issue titles:
${titlesList}

Generate a cluster title, summary, and category for this group.`;
}

export const CLUSTER_MERGE_SYSTEM_PROMPT = `You are a product analyst deciding whether two user needs describe the same underlying request. Two needs should merge if they describe the same core functionality or fix, even if worded differently. They should NOT merge if they're in the same general area but address different specific problems.`;

export function buildClusterMergePrompt(need1: string, need2: string): string {
  return `Should these two user needs be merged into a single cluster?

Need A: ${need1}
Need B: ${need2}

Decide if they describe the same underlying user need.`;
}
