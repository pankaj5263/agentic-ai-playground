export function estimateCost(totalTokens: number): number {
  const pricePerThousand = 0.0002 // example, adjust to real Groq pricing
  return (totalTokens / 1000) * pricePerThousand
}