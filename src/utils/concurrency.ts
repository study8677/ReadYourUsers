/** Run async tasks with a concurrency limit */
export async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker(): Promise<void> {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await fn(items[index], index);
    }
  }

  const effectiveConcurrency = Math.min(concurrency || 5, items.length);
  const workers = Array.from(
    { length: effectiveConcurrency },
    () => worker()
  );
  await Promise.all(workers);
  return results;
}
