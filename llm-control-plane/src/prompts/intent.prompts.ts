export function buildIntentPrompt(userInput: string): string {
  return `
You are an intent classification engine.

Return ONLY valid JSON in this format:

{
  "intent": "summarize | classify | extract | question",
  "confidence": number between 0 and 1,
  "reasoning": string
}

Message:
${userInput}
`
}