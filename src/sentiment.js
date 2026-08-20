const POSITIVE = [
  'excelente',
  'perfecto',
  'genial',
  'increible',
  'increíble',
  'super',
  'súper',
  'sencillo',
  'facil',
  'fácil',
  'rapido',
  'rápido',
  'rapidez',
  'instante',
  'buena',
  'bueno',
  'bien',
  'me gusta',
  'me gustaria',
  'me gustaría',
  'encanta',
  'claro',
  'claridad',
  'util',
  'útil',
  'satisfech',
  'agradec',
]

const NEGATIVE = [
  'error',
  'fallo',
  'falló',
  'falla',
  'mal',
  'malo',
  'mala',
  'pesimo',
  'pésimo',
  'horrible',
  'lento',
  'problema',
  'reintent',
  'no entendi',
  'no entendí',
  'no funciona',
  'no me dijo',
  'confund',
  'dificil',
  'difícil',
  'nunca',
  'crash',
  'bug',
  'odio',
  'frustr',
  'demora',
]

function normalize(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function countMatches(text, phrases) {
  return phrases.reduce((count, phrase) => {
    const needle = normalize(phrase)
    return count + (needle && text.includes(needle) ? 1 : 0)
  }, 0)
}

export function analyzeSentiment(comment) {
  const text = normalize(comment).trim()
  if (!text) {
    return { label: 'neutral', score: 0 }
  }

  const positive = countMatches(text, POSITIVE)
  const negative = countMatches(text, NEGATIVE)
  const total = positive + negative

  if (!total) {
    return { label: 'neutral', score: 0 }
  }

  const score = Math.round(((positive - negative) / total) * 100) / 100

  let label = 'neutral'
  if (score > 0.15) label = 'positivo'
  else if (score < -0.15) label = 'negativo'

  return { label, score }
}
