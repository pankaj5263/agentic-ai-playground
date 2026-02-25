import { getModel } from "../llm/model"
import { extractJSON } from "../parsers/json.parser"
import { intentSchema, IntentOutput } from "../schemas/intent.schema"
import { withRetry } from "../core/retry"

const model = getModel()

export async function classifyIntent(
  userInput: string
): Promise<IntentOutput> {

  return withRetry(async () => {

    const response = await model.invoke(`
Classify the intent of this message.

Return ONLY valid JSON:

{
  "intent": "summarize | classify | extract | question",
  "confidence": number between 0 and 1,
  "reasoning": string
}

Message:
${userInput}
`)

    const parsed = extractJSON(response.content)

    return intentSchema.parse(parsed)

  }, 3)
}