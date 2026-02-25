import { LLMProvider } from "./provider.interface"
import { GroqProvider } from "./groq.provider"
import { config } from "./config"

export function getModel(): LLMProvider {
  switch (config.provider) {
    case "groq":
      return new GroqProvider()
    default:
      throw new Error("Unsupported model provider")
  }
}