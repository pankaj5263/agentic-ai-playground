import { executeLLM } from "../core/llm.executer"
import { intentSchema, IntentOutput } from "../schemas/intent.schema"
import { buildIntentPrompt } from "../prompts/intent.prompts"

export async function classifyIntent(
  userInput: string
): Promise<IntentOutput> {

  return executeLLM({
    prompt: buildIntentPrompt(userInput),
    schema: intentSchema
  })
}