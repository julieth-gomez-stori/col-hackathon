export {
  CSAT_TAG_KEYS,
  LOW_CSAT_MAX_STARS,
  shouldAnalyzeComment,
  shouldCollectOpenText,
  skippedAiFields,
} from './csatCore.js'

export async function fetchGeminiStatus() {
  const response = await fetch('/api/analyze-csat')
  const payload = await response.json().catch(() => ({}))
  return Boolean(payload.configured)
}

export async function analyzeCsatComment(openText) {
  const response = await fetch('/api/analyze-csat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment: String(openText || '').trim() }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(payload.error || `Análisis IA HTTP ${response.status}`)
  }

  return payload
}
