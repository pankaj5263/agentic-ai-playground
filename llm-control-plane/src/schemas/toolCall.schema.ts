import { z } from "zod"

export const toolCallSchema = z.object({
  tool: z.string(),
  args: z.any()
})

export type ToolCall = z.infer<typeof toolCallSchema>