/*
 * Espejo de getIllustration() del Design System: resuelve ilustraciones 3D de Stori
 * desde el CDN público que usa el componente Image del design system.
 */

const BASE_URL = 'https://d1nmg9fup890vg.cloudfront.net/illustrations'

const THEMES = {
  credit: 'stori_card',
  debit: 'stori_cuenta',
  black: 'stori_black',
  shein: 'stori_shein',
  stori_card: 'stori_card',
  stori_cuenta: 'stori_cuenta',
  stori_black: 'stori_black',
  stori_shein: 'stori_shein',
}

export function getIllustration(name, theme = 'credit') {
  return `${BASE_URL}/${THEMES[theme] ?? THEMES.credit}/png/${name}.png`
}
