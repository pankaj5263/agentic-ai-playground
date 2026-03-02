export type SystemMessage = {
  role: "system"
  content: string
}

export type UserMessage = {
  role: "user"
  content: string
}

export type AssistantMessage = {
  role: "assistant"
  content?: string
  tool_calls?: any[]
}

export type ToolMessage = {
  role: "tool"
  tool_call_id: string
  content: string
}

export type ChatMessage =
  | SystemMessage
  | UserMessage
  | AssistantMessage
  | ToolMessage