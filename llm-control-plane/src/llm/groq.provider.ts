import Groq from "groq-sdk"
import { LLMProvider, LLMResponse } from "./provider.interface"
import { config } from "./config"

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export class GroqProvider implements LLMProvider {

  async invoke(messages: any[], tools?: any[]): Promise<LLMResponse> {

    const start = Date.now()

  const response = await client.chat.completions.create({
    model: config.model,
    temperature: config.temperature,
    max_tokens: config.maxTokens,
    messages,
    tools,
    tool_choice: tools ? "auto" : undefined
  })

    const latencyMs = Date.now() - start
    const message = response.choices[0]?.message

    console.log("Groq Response:", message)

    return {
      content: message?.content ?? "",
      toolCalls: message?.tool_calls ?? [],
      tokensIn: response.usage?.prompt_tokens ?? 0,
      tokensOut: response.usage?.completion_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0,
      latencyMs,
      model: response.model
    }
  }
}