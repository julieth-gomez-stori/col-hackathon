export const FREQUENCY_MODES = [
  { value: 'always', label: 'Siempre' },
  { value: 'times', label: 'Cantidad de veces' },
  { value: 'time', label: 'Tiempo' },
]

export const FREQUENCY_UNITS = [
  { value: 'days', label: 'días' },
  { value: 'weeks', label: 'semanas' },
  { value: 'months', label: 'meses' },
]

const UNIT_MS = {
  days: 24 * 60 * 60 * 1000,
  weeks: 7 * 24 * 60 * 60 * 1000,
  months: 30 * 24 * 60 * 60 * 1000,
}

const LEGACY = {
  always: { mode: 'always', value: 1, unit: 'months' },
  every_3: { mode: 'times', value: 3, unit: 'months' },
  monthly: { mode: 'time', value: 1, unit: 'months' },
}

export function normalizeFrequency(frequency) {
  if (typeof frequency === 'string') {
    return { ...(LEGACY[frequency] || LEGACY.always) }
  }
  const mode = FREQUENCY_MODES.some((item) => item.value === frequency?.mode) ? frequency.mode : 'always'
  const value = Math.max(1, Number(frequency?.value) || 1)
  const unit = FREQUENCY_UNITS.some((item) => item.value === frequency?.unit) ? frequency.unit : 'months'
  return { mode, value, unit }
}

export function frequencyLabel(frequency) {
  const { mode, value, unit } = normalizeFrequency(frequency)
  if (mode === 'always') return 'Cada vez que se ejecuta el evento'
  if (mode === 'times') {
    return value === 1
      ? 'Cada vez que se ejecuta el evento'
      : `Cada ${value} veces que se ejecuta el evento`
  }
  const unitLabel = FREQUENCY_UNITS.find((item) => item.value === unit)?.label || unit
  return value === 1 ? `Una vez cada ${unitLabel.replace(/s$/, '')}` : `Una vez cada ${value} ${unitLabel}`
}

export function frequencyWindowMs(frequency) {
  const { value, unit } = normalizeFrequency(frequency)
  return value * (UNIT_MS[unit] || UNIT_MS.months)
}
