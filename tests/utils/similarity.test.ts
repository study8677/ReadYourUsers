import { describe, expect, it } from "vitest";
import { textSimilarity } from "../../src/utils/similarity.js";

describe("textSimilarity", () => {
  it("returns 1 for identical strings", () => {
    expect(textSimilarity("fix memory leak", "fix memory leak")).toBe(1);
  });

  it("returns 0 for completely different strings", () => {
    const sim = textSimilarity("fix memory leak", "add dark theme support");
    expect(sim).toBeLessThan(0.2);
  });

  it("returns high similarity for close variants", () => {
    const sim = textSimilarity(
      "Support .env file loading",
      "Add .env file auto-loading support"
    );
    expect(sim).toBeGreaterThan(0.3);
  });

  it("handles empty strings", () => {
    expect(textSimilarity("", "")).toBe(1);
    expect(textSimilarity("hello", "")).toBe(0);
    expect(textSimilarity("", "hello")).toBe(0);
  });

  it("is case-insensitive", () => {
    expect(textSimilarity("Fix Bug", "fix bug")).toBe(1);
  });
});
