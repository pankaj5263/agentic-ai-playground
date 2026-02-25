export function logLLMCall(data: {
    model: string,
    tokensIn: number,
    tokensOut: number,
    totalTokens: number,
    latencyMs: number,
    retries: number,
    cost: number
}) {
  console.log("LLM CALL METRICS")
  console.log(JSON.stringify(data, null, 2))
}