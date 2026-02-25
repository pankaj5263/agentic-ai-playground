export const config = {
  provider: process.env.MODEL_PROVIDER || "openai",
  model: process.env.MODEL_NAME || "gpt-4o-mini",
  temperature: Number(process.env.TEMPERATURE || 0),
  maxTokens: Number(process.env.MAX_TOKENS || 500),
}