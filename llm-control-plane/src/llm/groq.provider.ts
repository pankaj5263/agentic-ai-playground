import Groq from "groq-sdk"
import { LLMProvider, LLMResponse } from "./provider.interface"
import { config } from "./config"

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export class GroqProvider implements LLMProvider {

  async invoke(prompt: string): Promise<LLMResponse> {
    const start = Date.now()

    const response = await client.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      max_tokens: config.maxTokens,
      messages: [
        { role: "system", content: "You are a precise AI system." },
        { role: "user", content: prompt }
      ],
    })

    const latencyMs = Date.now() - start

    return {
      content: response.choices[0]?.message?.content ?? "",
      tokensIn: response.usage?.prompt_tokens ?? 0,
      tokensOut: response.usage?.completion_tokens ?? 0,
      totalTokens: response.usage?.total_tokens ?? 0,
      latencyMs,
      model: response.model
    }
  }

  async *stream(prompt: string): AsyncGenerator<string> {
    const stream = await client.chat.completions.create({
      model: config.model,
      temperature: config.temperature,
      stream: true,
      messages: [
        { role: "system", content: "You are a precise AI system." },
        { role: "user", content: prompt }
      ],
    })

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) yield content
    }
  }
}