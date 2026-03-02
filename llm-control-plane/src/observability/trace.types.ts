export interface AgentIterationTrace {
  iteration: number
  model: string
  tokensIn: number
  tokensOut: number
  totalTokens: number
  latencyMs: number
  toolCalls?: string[]
}

export interface AgentRunTrace {
  sessionId: string
  startedAt: number
  iterations: AgentIterationTrace[]
  finalOutput?: string
  error?: string
  totalDurationMs?: number
}