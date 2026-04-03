import type { NeedCluster, RepoAggregation } from "./cluster.js";

export interface ProductSummaryCard {
  repo: string;
  slug: string;
  displayName: string;
  category: string;
  generatedAt: string;
  totalIssuesAnalyzed: number;
  totalIssuesIncluded: number;
  totalClusters: number;
  topNeed: NeedCluster | null;
  risingNeed: NeedCluster | null;
  dominantCategory: string | null;
  reportPaths: {
    en: string;
    zh: string;
  };
  aggregation: RepoAggregation;
}

export interface GlobalSignalCard {
  repo: string;
  slug: string;
  productName: string;
  title: string;
  category: string;
  demandScore: number;
  risingScore: number;
  volume: number;
  reportPath: string;
}

export interface CrossProductSummary {
  generatedAt: string;
  products: ProductSummaryCard[];
  hottestSignals: GlobalSignalCard[];
  sharedThemes: string[];
  uniqueThemes: Record<string, string[]>;
}
