import { getModel } from "../llm/model"
import { toolRegistry, getToolDefinitions } from "../tools/tool.registry"
import { InMemoryStore } from "../memory/inMemory.store"
import { agentRuntimeConfig } from "../runtime/agent.config"
import { AgentTracer } from "../observability/tracer"
import {
  IterationLimitExceededError,
  TokenBudgetExceededError,
  ToolExecutionError
} from "../errors/agent.errors"
import { ChatMessage } from "../types/chat.types"

enum AgentState {
  THINKING,
  CALLING_TOOL
}

const model = getModel()
const memory = new InMemoryStore()

export async function runAgent(
  userInput: string,
  sessionId: string = "default-session"
): Promise<string> {

  const tracer = new AgentTracer(sessionId)

  let state: AgentState = AgentState.THINKING
  let iteration = 0
  let accumulatedTokens = 0

  let messages: ChatMessage[] = memory.getMessages(sessionId)

  // Initialize system message
  if (messages.length === 0) {
    messages.push({
      role: "system",
      content: `
You are a state-driven AI agent.
You may call tools multiple times.
Only return final answer when complete.
`
    })
  }

  // Add user message
  messages.push({
    role: "user",
    content: userInput
  })

  const toolDefinitions = getToolDefinitions()

  try {

    while (true) {

      // 🔒 Iteration Guard
      if (iteration >= agentRuntimeConfig.maxIterations) {
        throw new IterationLimitExceededError("Max iterations exceeded")
      }

      iteration++

      // ===============================
      // 🧠 THINKING STATE
      // ===============================
      if (state === AgentState.THINKING) {

        const response = await model.invoke(messages, toolDefinitions)

        accumulatedTokens += response.totalTokens

        // 🔒 Token Guard
        if (accumulatedTokens > agentRuntimeConfig.maxTotalTokens) {
          throw new TokenBudgetExceededError("Token budget exceeded")
        }

        tracer.addIteration({
          iteration,
          model: response.model,
          tokensIn: response.tokensIn,
          tokensOut: response.tokensOut,
          totalTokens: response.totalTokens,
          latencyMs: response.latencyMs,
          toolCalls: response.toolCalls?.map((t: any) => t.function.name)
        })

        // 🔧 Tool requested
        if (response.toolCalls && response.toolCalls.length > 0) {

          messages.push({
            role: "assistant",
            tool_calls: response.toolCalls
          })

          state = AgentState.CALLING_TOOL
          continue
        }

        // ✅ Final answer
        messages.push({
          role: "assistant",
          content: response.content
        })

        tracer.finish(response.content)
        memory.saveMessages(sessionId, messages)

        return response.content
      }

      // ===============================
      // 🔧 CALLING TOOL STATE
      // ===============================
      if (state === AgentState.CALLING_TOOL) {

        const lastMessage = messages[messages.length - 1]

        if (
          lastMessage.role !== "assistant" ||
          !lastMessage.tool_calls
        ) {
          throw new Error("Expected assistant tool call message")
        }

        const results = await Promise.all(
          lastMessage.tool_calls.map(async (call: any) => {

            const toolName = call.function.name
            const toolArgs = JSON.parse(call.function.arguments)

            const tool = toolRegistry[toolName]
            if (!tool) {
              throw new ToolExecutionError(`Unknown tool: ${toolName}`)
            }

            const result = await tool.execute(toolArgs)

            return {
              tool_call_id: call.id,
              result
            }
          })
        )

        // Append tool results
        results.forEach(r => {
          messages.push({
            role: "tool",
            tool_call_id: r.tool_call_id,
            content: JSON.stringify(r.result)
          })
        })

        state = AgentState.THINKING
      }
    }

  } catch (err: any) {
    tracer.fail(err.message)
    throw err
  }
}