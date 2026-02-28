export interface LLMResponse {
  content: string,
  toolCalls: any[],
  tokensIn: number,
  tokensOut: number,
  totalTokens: number,
  latencyMs: number,
  model: string
}

export interface LLMProvider {
  invoke(messages: any[], tools?: any[]): Promise<LLMResponse>
}