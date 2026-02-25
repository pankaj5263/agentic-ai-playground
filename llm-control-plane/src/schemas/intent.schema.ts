import { z } from "zod"

export const intentSchema = z.object({
  intent: z.enum(["summarize", "classify", "extract", "question"]),
  confidence: z.number().min(0).max(1),
  reasoning: z.string(),
})

export type IntentOutput = z.infer<typeof intentSchema>