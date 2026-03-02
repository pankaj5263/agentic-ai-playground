import { MemoryStore } from "./memory.interface"
import { ChatMessage } from "../types/chat.types"

export class InMemoryStore implements MemoryStore {

  private store: Record<string, ChatMessage[]> = {}

  getMessages(sessionId: string): ChatMessage[] {
    return this.store[sessionId] || []
  }

  saveMessages(sessionId: string, messages: ChatMessage[]): void {
    this.store[sessionId] = messages
  }
}