import { randomUUID } from "crypto";
import "dotenv/config";
import Groq from "groq-sdk";
import readline from "readline";

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ---------------- In-Memory DB ----------------
let todoDatabase = [];

// ---------------- Core Logic ----------------
const actions = {
  add: ({ text }) => {
    const newTodo = { id: randomUUID(), message: text };
    todoDatabase.push(newTodo);
    return newTodo;
  },

  search: ({ text }) => {
    return todoDatabase.filter((todo) =>
      todo.message.toLowerCase().includes(text.toLowerCase())
    );
  },

  remove: ({ text }) => {
    const beforeLength = todoDatabase.length;
    todoDatabase = todoDatabase.filter(
      (todo) => !todo.message.toLowerCase().includes(text.toLowerCase())
    );
    return {
      removed: beforeLength - todoDatabase.length,
      remaining: todoDatabase.length,
    };
  },
};

// ---------------- Tools Definition (Outside) ----------------
const tools = Object.keys(actions).map((name) => ({
  type: "function",
  function: {
    name,
    description: `${name} todo in database`,
    parameters: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Text of todo",
        },
      },
      required: ["text"],
    },
  },
}));

// ---------------- System Prompt ----------------
const SYSTEM_PROMPT = `
You are a todo app assistant.
Always use tools when user wants to add, remove, or search todos.
`;

let messages = [{ role: "system", content: SYSTEM_PROMPT }];

// ---------------- Chat Handler ----------------
async function handleUserInput(input) {
  try {
    messages.push({ role: "user", content: input });

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages,
      tools,
      tool_choice: "auto",
    });

    const message = response.choices[0].message;

    // If model wants to call tool
    if (message.tool_calls?.length) {
      messages.push(message);

      console.log("message", message)

      for (const toolCall of message.tool_calls) {
        const { name, arguments: args } = toolCall.function;
        const parsedArgs = JSON.parse(args);

        const result = actions[name](parsedArgs);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      // Second call after tool execution
      const finalResponse = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages,
      });

      console.log("AI:", finalResponse.choices[0].message.content);
      messages.push(finalResponse.choices[0].message);
    } else {
      console.log("AI:", message.content);
      messages.push(message);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// ---------------- CLI Loop ----------------
function start() {
  rl.question(
    "I am Todo app. What should I do? >>>\n",
    async (input) => {
      if (input.toLowerCase() === "exit") {
        rl.close();
        return;
      }

      await handleUserInput(input);
      start();
    }
  );
}

start();
