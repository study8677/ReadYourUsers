/** Tokenize a string into lowercase word bigrams */
function wordBigrams(text: string): Set<string> {
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
  const bigrams = new Set<string>();
  for (let i = 0; i < words.length - 1; i++) {
    bigrams.add(`${words[i]} ${words[i + 1]}`);
  }
  // Also add individual words for short texts
  for (const w of words) {
    bigrams.add(w);
  }
  return bigrams;
}

/** Jaccard similarity between two strings using word bigrams. Returns 0-1. */
export function textSimilarity(a: string, b: string): number {
  const setA = wordBigrams(a);
  const setB = wordBigrams(b);
  if (setA.size === 0 && setB.size === 0) return 1;
  if (setA.size === 0 || setB.size === 0) return 0;
  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  return intersection / (setA.size + setB.size - intersection);
}
