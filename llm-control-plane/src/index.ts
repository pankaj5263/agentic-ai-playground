import "dotenv/config"
import { getModel } from "./llm/model"

async function main() {
  const model = getModel()

  const response = await model.invoke(
    "Classify this sentence: I want to summarize a document."
  )

  console.log(response)
}

main()