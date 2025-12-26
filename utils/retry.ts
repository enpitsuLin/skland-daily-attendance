export async function retry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
): Promise<T> {
  try {
    return await fn()
  }
  catch (error) {
    if (retries > 0) {
      console.log(`操作失败，剩余重试次数: ${retries}`)
      await new Promise(resolve => setTimeout(resolve, delay))
      return retry(fn, retries - 1, delay)
    }
    throw error
  }
}
