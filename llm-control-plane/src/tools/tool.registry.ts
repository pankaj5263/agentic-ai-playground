import { calculatorTool } from "./calculator.tool"
import { Tool } from "./tool.interface"

export const tools: Tool[] = [
  calculatorTool
]

export const toolRegistry: Record<string, Tool> =
  Object.fromEntries(tools.map(t => [t.name, t]))

export function getToolDefinitions() {
  return tools.map(tool => ({
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters
    }
  }))
}