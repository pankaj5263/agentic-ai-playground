import { ChatMessage } from "../types/chat.types"

export interface LLMResponse {
  content: string
  toolCalls?: any[]
  tokensIn: number
  tokensOut: number
  totalTokens: number
  latencyMs: number
  model: string
}

export interface LLMProvider {
  invoke(
    messages: ChatMessage[],
    tools?: any[]
  ): Promise<LLMResponse>
}