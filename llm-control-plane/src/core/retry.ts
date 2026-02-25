export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number
): Promise<T> {

  let attempt = 0
  let lastError: unknown

  while (attempt < maxRetries) {
    try {
      return await fn()
    } catch (err) {
      lastError = err
      attempt++
      console.warn(`Retry ${attempt} failed`)
    }
  }

  throw lastError
}