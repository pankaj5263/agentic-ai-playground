import { Tool } from "./tool.interface"

export const calculatorTool: Tool = {
  name: "calculator",
  description: "Performs mathematical calculations",

  parameters: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "Mathematical expression to evaluate"
      }
    },
    required: ["expression"]
  },

  async execute(args: { expression: string }) {
    const result = eval(args.expression)
    return { result }
  }
}