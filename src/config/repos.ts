import { z } from "zod";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const RepoConfigSchema = z.object({
  repo: z.string().regex(/^[^/]+\/[^/]+$/, "Must be in owner/repo format"),
  display_name: z.string(),
  category: z.string(),
  include_in_homepage: z.boolean(),
  weight: z.number().min(0).max(2),
  notes: z.string().optional(),
});

const ReposFileSchema = z.object({
  repos: z.array(RepoConfigSchema),
});

export type RepoConfig = z.infer<typeof RepoConfigSchema>;

export function loadRepoConfigs(configPath?: string): RepoConfig[] {
  const path = configPath ?? resolve(process.cwd(), "config/repos.json");
  const raw = readFileSync(path, "utf-8");
  const parsed = ReposFileSchema.parse(JSON.parse(raw));
  return parsed.repos;
}

export function getRepoConfig(
  configs: RepoConfig[],
  repo: string
): RepoConfig | undefined {
  return configs.find((c) => c.repo === repo);
}

export function repoSlug(repo: string): string {
  return repo.replace("/", "-");
}
