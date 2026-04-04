import { z } from "zod";

export const IssueAnalysisSchema = z.object({
  issue_type: z.enum([
    "bug_report",
    "feature_request",
    "improvement",
    "question",
    "documentation",
    "performance",
    "other",
  ]).describe("The type of this issue"),
  normalized_need: z
    .string()
    .describe(
      "A concise, canonical description of what the user needs, written in imperative form. E.g. 'Support .env file auto-loading' or 'Fix memory leak in large file indexing'"
    ),
  module_tags: z
    .array(z.string())
    .min(1)
    .max(5)
    .describe(
      "Functional area tags like 'auth', 'cli', 'performance', 'configuration', 'editor'"
    ),
  user_intent: z
    .string()
    .describe("One sentence summarizing what the user is trying to accomplish"),
  severity_hint: z.enum(["critical", "major", "moderate", "minor", "cosmetic"]),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("How confident you are in this analysis, 0.0 to 1.0"),
  should_include: z
    .boolean()
    .describe(
      "False if the issue is spam, off-topic, a pure support question with no generalizable need, or a pull request discussion"
    ),
});

export type IssueAnalysisOutput = z.infer<typeof IssueAnalysisSchema>;

export const ClusterMergeSchema = z.object({
  should_merge: z
    .boolean()
    .describe("Whether these two needs describe the same underlying user need"),
  reason: z.string().describe("Brief explanation of why they should or should not merge"),
});

export const ThemeMatchSchema = z.object({
  shared_themes: z.array(z.object({
    theme: z.string().describe("A canonical theme name shared across products"),
    products: z.array(z.string()).describe("Product names that share this theme"),
  })).describe("Themes that appear in multiple products"),
});

export const ClusterSummarySchema = z.object({
  title: z
    .string()
    .describe(
      "A concise, descriptive title for this cluster of user needs (5-10 words)"
    ),
  summary: z
    .string()
    .describe(
      "A 2-3 sentence summary of what users in this cluster are asking for and why"
    ),
  category: z
    .string()
    .describe(
      "A broad category like 'Developer Experience', 'Performance', 'Configuration', 'Integration', 'Documentation'"
    ),
});
