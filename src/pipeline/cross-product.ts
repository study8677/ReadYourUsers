import { repoSlug, type RepoConfig } from "../config/repos.js";
import type { NeedCluster, RepoAggregation } from "../models/cluster.js";
import type {
  CrossProductSummary,
  GlobalSignalCard,
  ProductSummaryCard,
} from "../models/site.js";

export interface CrossProductInput {
  config: RepoConfig;
  aggregation: RepoAggregation;
}

function compareText(left: string, right: string): number {
  return left.localeCompare(right, "en");
}

function compareClusters(left: NeedCluster, right: NeedCluster): number {
  return (
    right.demand_score - left.demand_score ||
    right.rising_score - left.rising_score ||
    right.volume - left.volume ||
    compareText(left.title, right.title) ||
    compareText(left.cluster_id, right.cluster_id)
  );
}

function compareRisingClusters(left: NeedCluster, right: NeedCluster): number {
  return (
    right.rising_score - left.rising_score ||
    right.demand_score - left.demand_score ||
    right.volume - left.volume ||
    compareText(left.title, right.title) ||
    compareText(left.cluster_id, right.cluster_id)
  );
}

function dominantCategory(breakdown: Record<string, number>): string | null {
  const [category] = Object.entries(breakdown)
    .sort(
      ([leftCategory, leftCount], [rightCategory, rightCount]) =>
        rightCount - leftCount || compareText(leftCategory, rightCategory)
    )[0] ?? [null];

  return category;
}

function selectRisingNeed(clusters: NeedCluster[]): NeedCluster | null {
  return [...clusters]
    .filter((cluster) => cluster.rising_score > 1)
    .sort(compareRisingClusters)[0] ?? null;
}

function buildProductCard({ config, aggregation }: CrossProductInput): ProductSummaryCard {
  const slug = repoSlug(config.repo);
  const byDemand = [...aggregation.clusters].sort(compareClusters);

  return {
    repo: config.repo,
    slug,
    displayName: config.display_name,
    category: config.category,
    generatedAt: aggregation.generated_at,
    totalIssuesAnalyzed: aggregation.total_issues_analyzed,
    totalIssuesIncluded: aggregation.total_issues_included,
    totalClusters: aggregation.clusters.length,
    topNeed: byDemand[0] ?? null,
    risingNeed: selectRisingNeed(aggregation.clusters),
    dominantCategory: dominantCategory(aggregation.category_breakdown),
    reportPaths: {
      en: `reports/latest/${slug}.md`,
      zh: `reports/latest/${slug}.zh.md`,
    },
    aggregation,
  };
}

function buildSignalCards(product: ProductSummaryCard): GlobalSignalCard[] {
  return [...product.aggregation.clusters]
    .sort(compareClusters)
    .slice(0, 3)
    .map((cluster) => ({
      repo: product.repo,
      slug: product.slug,
      productName: product.displayName,
      title: cluster.title,
      category: cluster.category,
      demandScore: cluster.demand_score,
      risingScore: cluster.rising_score,
      volume: cluster.volume,
      reportPath: product.reportPaths.en,
    }));
}

export function buildCrossProductSummary(
  inputs: CrossProductInput[]
): CrossProductSummary {
  const products = [...inputs]
    .map(buildProductCard)
    .sort(
      (left, right) =>
        (right.topNeed?.demand_score ?? -1) - (left.topNeed?.demand_score ?? -1) ||
        (right.topNeed?.rising_score ?? -1) - (left.topNeed?.rising_score ?? -1) ||
        compareText(left.displayName, right.displayName) ||
        compareText(left.repo, right.repo)
    );

  const hottestSignals = products
    .flatMap(buildSignalCards)
    .sort(
      (left, right) =>
        right.demandScore - left.demandScore ||
        right.risingScore - left.risingScore ||
        right.volume - left.volume ||
        compareText(left.productName, right.productName) ||
        compareText(left.title, right.title)
    )
    .slice(0, 8);

  const categoryOwners = new Map<string, Set<string>>();
  for (const product of products) {
    for (const cluster of product.aggregation.clusters) {
      const theme = cluster.category.toLowerCase();
      const owners = categoryOwners.get(theme) ?? new Set<string>();
      owners.add(product.slug);
      categoryOwners.set(theme, owners);
    }
  }

  const sharedThemes = [...categoryOwners.entries()]
    .filter(([, owners]) => owners.size > 1)
    .map(([theme]) => theme)
    .sort(compareText);

  const uniqueThemes = Object.fromEntries(
    products.map((product) => {
      const themes = [...new Set(product.aggregation.clusters.map((cluster) => cluster.category.toLowerCase()))]
        .filter((theme) => !sharedThemes.includes(theme))
        .sort(compareText);

      return [product.slug, themes];
    })
  );

  return {
    generatedAt:
      products
        .map((product) => product.generatedAt)
        .sort((left, right) => compareText(right, left))[0] ?? new Date(0).toISOString(),
    products,
    hottestSignals,
    sharedThemes,
    uniqueThemes,
  };
}
