export interface LLMResponse {
  content: string
  tokensIn: number
  tokensOut: number
  totalTokens: number
  latencyMs: number
  model: string
}

export interface LLMProvider {
  invoke(prompt: string): Promise<LLMResponse>
  stream(prompt: string): AsyncGenerator<string>
}