import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { repoSlug } from "../config/repos.js";

export function dataDir(base: string, stage: string, repo: string): string {
  const dir = resolve(base, stage, repoSlug(repo));
  mkdirSync(dir, { recursive: true });
  return dir;
}

export function readJSON<T>(filePath: string): T | null {
  if (!existsSync(filePath)) return null;
  const raw = readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeJSON(filePath: string, data: unknown): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}
