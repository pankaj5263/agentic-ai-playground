import { getModel } from "../llm/model"
import { extractJSON } from "../parsers/json.parser"
import { withRetry } from "./retry"
import { estimateCost } from "./cost"
import { logLLMCall } from "./logger"
import { ZodSchema } from "zod"

const model = getModel()

interface ExecuteOptions<T> {
  prompt: string
  schema: ZodSchema<T>
  maxRetries?: number
}

export async function executeLLM<T>({
  prompt,
  schema,
  maxRetries = 3
}: ExecuteOptions<T>): Promise<T> {

  let retryCount = 0

  return withRetry(async () => {

    retryCount++

    const response = await model.invoke(prompt)

    const parsed = extractJSON(response.content)

    const validated = schema.parse(parsed)

    const cost = estimateCost(response.totalTokens)

    logLLMCall({
      model: response.model,
      tokensIn: response.tokensIn,
      tokensOut: response.tokensOut,
      totalTokens: response.totalTokens,
      latencyMs: response.latencyMs,
      retries: retryCount - 1,
      cost
    })

    return validated

  }, maxRetries)
}