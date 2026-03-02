import { ChatMessage } from "../types/chat.types"

export interface MemoryStore {
  getMessages(sessionId: string): ChatMessage[]
  saveMessages(sessionId: string, messages: ChatMessage[]): void
}