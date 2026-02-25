import { executeLLM } from "../core/llm.executer"
import { intentSchema, IntentOutput } from "../schemas/intent.schema"

export async function classifyIntent(
  userInput: string
): Promise<IntentOutput> {

  const prompt = `
Classify the intent of this message.

Return ONLY valid JSON:

{
  "intent": "summarize | classify | extract | question",
  "confidence": number between 0 and 1,
  "reasoning": string
}

Message:
${userInput}
`

  return executeLLM({
    prompt,
    schema: intentSchema
  })
}