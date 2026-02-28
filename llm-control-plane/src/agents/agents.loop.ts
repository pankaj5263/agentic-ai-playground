import { getModel } from "../llm/model";
import { toolRegistry } from "../tools/tool.registry";
import { getToolDefinitions } from "../tools/tool.registry";

const model = getModel();

export async function runAgent(userInput: string) {
  const toolDefinitions = getToolDefinitions();

  const maxIterations = 5;
  let iteration = 0;

  // Conversation memory
  const messages: any[] = [
    {
      role: "system",
      content: `
You are an AI agent.

If calculation is required, use the calculator tool.
Otherwise respond normally.

You may call tools multiple times before giving final answer.
`,
    },
    {
      role: "user",
      content: userInput,
    },
  ];

  while (iteration < maxIterations) {
    iteration++;

    const response = await model.invoke(messages, toolDefinitions);

    // 📊 Optional: log metrics here if needed
    console.log(`Agent Iteration ${iteration}`);
    console.log("Tool Calls:", response.toolCalls);

    // If tool was called
    if (response.toolCalls && response.toolCalls.length > 0) {
      const toolCall = response.toolCalls[0];
      const toolName = toolCall.function.name;
      const toolArgs = JSON.parse(toolCall.function.arguments);

      const tool = toolRegistry[toolName];

      if (!tool) {
        throw new Error(`Unknown tool: ${toolName}`);
      }

      const result = await tool.execute(toolArgs);

      // Add assistant tool call message
      messages.push({
        role: "assistant",
        tool_calls: response.toolCalls,
      });

      // Add tool result message
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });

      continue;
    }

    // No tool calls → final answer
    return response.content;
  }

  throw new Error("Agent exceeded max iterations");
}
