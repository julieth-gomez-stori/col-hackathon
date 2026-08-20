import { CSAT_AGENT_INSTRUCTIONS, normalizeAgentOutput, parseAgentJson } from './csatCore.js'

export async function runCsatAgent(openText, { apiKey, model }) {
  const comment = String(openText || '').trim()
  if (!comment) throw new Error('El comentario está vacío.')
  if (!apiKey) throw new Error('Falta GEMINI_API_KEY en el entorno.')

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: CSAT_AGENT_INSTRUCTIONS }] },
      contents: [{ role: 'user', parts: [{ text: `<open_text>${comment}</open_text>` }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    const message = payload?.error?.message || `Gemini HTTP ${response.status}`
    throw new Error(message)
  }

  const text = payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || ''
  return normalizeAgentOutput(parseAgentJson(text))
}
