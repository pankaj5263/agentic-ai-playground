// i want to create todo app by ai agentic way

import readline from "readline";
import "dotenv/config"
import Groq from "groq-sdk";
import { randomUUID } from "crypto";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const groqClient = new Groq({
    apiKey: process.env.GROQ_API_KEY
}) 

const listOfTools = () => {
  return {
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
  remove:({ text }) => {
    const beforeLength = todoDatabase.length;
    todoDatabase = todoDatabase.filter(
      (todo) => !todo.message.toLowerCase().includes(text.toLowerCase())
    );
    return {
      removed: beforeLength - todoDatabase.length,
      remaining: todoDatabase.length,
    };
  }
  }
}



let todoDatabase = [];


const SYSTEM_PROMPT = ` you ara todo app assistance.
 your work to add, search and remove from todoDatabase.
 you will final always return a ai response according to tododatabase
 use tools
 for add - use tool add
 for remove - use remove tool
 for search - use search tool
 `

 const messages = [{role:'system', content:SYSTEM_PROMPT}];

 const tools = [{
  type: "function",
  function: {
    name: 'add',
    description: `add todo in todoDatabase`,
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
},
{
  type: "function",
  function: {
    name: 'remove',
    description: `remove todo from todoDatabase`,
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
},
{
  type: "function",
  function: {
    name: 'search',
    description: `search from todoDatabase`,
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
}
]


const chatLlm = async (messages, tools) => {
   return await groqClient.chat.completions.create({
    messages,
    model:'openai/gpt-oss-20b',
    tools,
    tool_choice:'auto'
   });
}


function start(){

    rl.question('This is todo app. let me know what should i do >> ', async (params)=>{
      console.log(params);
      messages.push({role:'user', content:params});
      
      const response = await chatLlm(messages, tools);
      const message = response?.choices[0]?.message;
      if(message?.tool_calls && message?.tool_calls.length>0){
        const toolCall = message?.tool_calls[0];
        if(toolCall && (toolCall?.function.name === 'add' || toolCall?.function.name === 'search' || toolCall?.function.name === 'remove')){
         const finalTool = listOfTools()[toolCall?.function.name]
         const args = JSON.parse(toolCall?.function?.arguments);
         console.log(args);
         const result = finalTool(args);
         messages.push(message);
         messages.push({
            role:'tool',
            tool_call_id: toolCall?.id,
            content: JSON.stringify(result)
         });

         const response = await chatLlm(messages, tools);
         console.log("response final", response?.choices[0].message?.content);

         start();

        }
      }
    })
    
}

start();