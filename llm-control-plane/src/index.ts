// import "dotenv/config"
// import { getModel } from "./llm/model"

// async function main() {
//   const model = getModel()

//   const response = await model.invoke(
//     "Classify this sentence: I want to summarize a document."
//   )

//   console.log(response)
// }

// main()




// import "dotenv/config"
// import { classifyIntent } from "./pipelines/intent.pipeline"

// async function main() {
//   const result = await classifyIntent(
//     "Please summarize this document."
//   )

//   console.log("Validated Output:")
//   console.log(result)
// }

// main()



import "dotenv/config"
import { runAgent } from "./agents/agents.loop"

async function main() {
  try {
    const result = await runAgent("What is 245 * 19 and then add 120?")
    console.log("Agent Result:")
    console.log(result)
  } catch (error) {
    console.error("Agent Error:", error)
  }
}

main()