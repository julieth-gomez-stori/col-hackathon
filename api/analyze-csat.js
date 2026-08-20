import { geminiConfigFromEnv } from '../src/ai/csatCore.js'
import { runCsatAgent } from '../src/ai/runCsatAgent.js'

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json')

  const { apiKey, model, configured } = geminiConfigFromEnv(process.env)

  if (req.method === 'GET') {
    res.status(200).json({ configured })
    return
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const comment = String(req.body?.comment || '').trim()
    const insight = await runCsatAgent(comment, { apiKey, model })
    res.status(200).json(insight)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo analizar el comentario.'
    res.status(500).json({ error: message })
  }
}
