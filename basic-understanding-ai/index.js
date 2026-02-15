import "dotenv/config";
import Groq from "groq-sdk";
import { type } from "os";
import readline from "readline";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ---------------- FAKE DATABASE ----------------
const cities = {
  delhi: 10,
  agra: 14,
  kashmir: -10,
};

function getWeatherDetails(city) {
  return cities[city.toLowerCase()] ?? 0;
}

const SYSTEM_PROMPT = `
You are an AI assistant with START, PLAN, ACTION, OBSERVATION and OUTPUT states.

Follow this strict loop:
1. PLAN what tool to call
2. ACTION call the tool
3. Wait for OBSERVATION
4. Finally produce OUTPUT

Available Tools:
- getWeatherDetails(city: string)
;
`

const user = "Hey, what is the sum of  weather of Agra, kashmir and Delhi?";

async function chat() {
  let messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: user },
  ];

  while(true){
    const response = await groq.chat.completions.create({
      messages: messages,
      model:"openai/gpt-oss-20b",
      tool_choice: "auto",
      tools:[{
        type:"function",
        function:{
          name: "getWeatherDetails",
          description:"get current weather for a city",
          parameters:{
            type: "object",
            properties: {
              city:{
                type: "string",
                description:"City name",
              }
            }
          },
          required:["city"]
        }
      }],
    });

    const message = response.choices[0].message;

    console.log("response", message, message?.tool_calls);
    if(message?.tool_calls && message?.tool_calls.length>0){
      console.log("we are in ")
      const tool_call = message.tool_calls[0];
      console.log("Tool call",tool_call);
      if(tool_call?.function.name === 'getWeatherDetails'){
          const args = JSON.parse(tool_call.function.arguments);
          const city = args.city;
          console.log("city", city)
          const result = getWeatherDetails(city);
          console.log("resulyt", result);
          messages.push(message);
          messages.push({
            role:"tool",
            tool_call_id: tool_call?.id,
            content: String(result)
          })
      }

    } else {
      console.log("Final Answer:", message.content);

        break;
    }
   
  }
}

chat();