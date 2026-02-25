export function extractJSON(text: string): unknown {
  const match = text.match(/\{[\s\S]*\}/)

  if (!match) {
    throw new Error("No JSON found in response")
  }

  return JSON.parse(match[0])
}