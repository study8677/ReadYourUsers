/** Default window for weekly analysis (days) */
export const WEEKLY_WINDOW_DAYS = 7;

/** Default window for trend analysis (days) */
export const TREND_WINDOW_DAYS = 30;

/** Max issues per page from GitHub API */
export const GITHUB_PER_PAGE = 100;

/** Default concurrency for LLM analysis */
export const DEFAULT_ANALYSIS_CONCURRENCY = 5;

/** Default similarity threshold for clustering */
export const DEFAULT_SIMILARITY_THRESHOLD = 0.4;

/** Minimum cluster size to include in reports */
export const DEFAULT_MIN_CLUSTER_SIZE = 2;

const isOpenRouterOpenAIProvider =
  process.env.LLM_PROVIDER === "openai" &&
  process.env.OPENAI_BASE_URL?.includes("openrouter.ai");

/** Model for per-issue analysis (fast, cheap) */
export const ANALYSIS_MODEL =
  process.env.ANALYSIS_MODEL ??
  (process.env.LLM_PROVIDER === "openai"
    ? isOpenRouterOpenAIProvider
      ? "qwen/qwen3.6-plus:free"
      : "gpt-4o-mini"
    : "claude-haiku-4-5-20241022");

/** Model for aggregation/summarization (stronger) */
export const AGGREGATION_MODEL =
  process.env.AGGREGATION_MODEL ??
  (process.env.LLM_PROVIDER === "openai"
    ? isOpenRouterOpenAIProvider
      ? "qwen/qwen3.6-plus:free"
      : "gpt-4o"
    : "claude-sonnet-4-5-20241022");

/** Top N clusters for reports */
export const TOP_N_REPORT = 10;

/** Recency decay half-life in days */
export const RECENCY_HALF_LIFE_DAYS = 62;
