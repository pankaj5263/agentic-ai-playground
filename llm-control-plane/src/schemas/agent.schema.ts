import { z } from "zod"

export const agentStepSchema = z.union([
  z.object({
    tool: z.string(),
    args: z.any()
  }),
  z.object({
    final_answer: z.string()
  })
])

export type AgentStep = z.infer<typeof agentStepSchema>