// lib/retry.ts
export async function retry<T>(
  fn: () => Promise<T>,
  {
    retries = 3,
    delay = 500,
    factor = 2,
  }: {
    retries?: number;
    delay?: number;
    factor?: number;
  } = {}
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;

    await new Promise((res) => setTimeout(res, delay));
    return retry(fn, {
      retries: retries - 1,
      delay: delay * factor,
      factor,
    });
  }
}
