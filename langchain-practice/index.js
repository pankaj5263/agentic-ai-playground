

import { ChatGroq } from "@langchain/groq";
import { HumanMessage } from "@langchain/core/messages";

const client = new ChatGroq({
  apiKey: GROQ_API_KEY,
  model: "openai/gpt-oss-20b",
  temperature: 0.7,
});

const re = await client.client.chat.completions.create({messages:[{role:"user", content:"Today is T20 world match south afrika vs india i want time and broadcast channel, in india"}], model:"openai/gpt-oss-20b"})

console.log(re.choices[0].message.content);

// const response = await model.invoke([
//   new HumanMessage("Today is T20 world match south afrika vs india can predict who can win"),
// ]);

// console.log(response.content);
