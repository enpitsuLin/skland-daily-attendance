export interface RetryOptions {
  retries?: number
  delay?: number
  onRetry?: (retriesLeft: number, error: unknown) => void
}

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { retries = 3, delay = 1000, onRetry } = options

  try {
    return await fn()
  }
  catch (error) {
    if (retries > 0) {
      onRetry?.(retries, error)
      await new Promise(resolve => setTimeout(resolve, delay))
      return retry(fn, { retries: retries - 1, delay, onRetry })
    }
    throw error
  }
}
