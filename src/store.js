import { reactive, watch } from 'vue'
import { createResponse, fetchForms, fetchResponses, upsertForm } from './api'
import { FREQUENCY_MODES, FREQUENCY_UNITS, frequencyLabel, normalizeFrequency } from './frequency'
import { defaultConfig, seedForms, seedResponses } from './seed'
import { analyzeSentiment } from './sentiment'

export const PRODUCTS = ['Credit', 'Secure Card', 'Luna', 'Clip', 'Tap2Pay', 'Deposits']
export const APP_VERSIONS = ['3.10.0', '3.11.0', '3.12.0']

export { FREQUENCY_MODES, FREQUENCY_UNITS, frequencyLabel, normalizeFrequency }

/* v3: owner, versión del formulario y frecuencia configurable (modo + número). */
const STORAGE_KEY = 'feedback-bottomsheet-mvp-v3'

export { defaultConfig }

function normalizeForm(form = {}) {
  return {
    ...defaultConfig,
    ...form,
    owner: form.owner || defaultConfig.owner,
    formVersion: form.formVersion || defaultConfig.formVersion,
    frequency: normalizeFrequency(form.frequency),
    pills: form.pills?.length ? [...form.pills] : [...defaultConfig.pills],
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { forms: seedForms(), responses: seedResponses() }

    const parsed = JSON.parse(raw)
    const forms = Array.isArray(parsed.forms) && parsed.forms.length ? parsed.forms : seedForms()

    return {
      forms: forms.map(normalizeForm),
      responses: Array.isArray(parsed.responses) ? parsed.responses : seedResponses(),
    }
  } catch {
    return { forms: seedForms(), responses: seedResponses() }
  }
}

const initial = loadState()

export const store = reactive({
  forms: initial.forms,
  responses: initial.responses,
})

watch(
  store,
  (value) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        forms: value.forms,
        responses: value.responses,
      }),
    )
  },
  { deep: true },
)

function persistBestEffort(label, task) {
  task().catch((err) => {
    console.warn(`[api] ${label} failed, keeping local cache`, err)
  })
}

export async function hydrateFromApi() {
  try {
    const [forms, responses] = await Promise.all([fetchForms(), fetchResponses()])
    if (forms.length) store.forms.splice(0, store.forms.length, ...forms.map(normalizeForm))
    if (responses.length) store.responses.splice(0, store.responses.length, ...responses)
  } catch (err) {
    console.warn('[api] hydrate skipped, using localStorage cache', err)
  }
}

export function saveForm(next) {
  const form = {
    ...normalizeForm(next),
    id: next.id || `form-${Date.now()}`,
  }
  const index = store.forms.findIndex((item) => item.id === form.id)
  if (index >= 0) Object.assign(store.forms[index], form)
  else store.forms.unshift(form)
  persistBestEffort('saveForm', () => upsertForm(form))
  return form
}

export function addResponse(form, payload) {
  const comment = payload.comment || ''
  const response = {
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString(),
    formId: form.id,
    product: form.product,
    appVersion: form.appVersion,
    eventName: form.eventName,
    formVersion: form.formVersion,
    owner: form.owner,
    ...payload,
    sentiment: comment.trim() ? analyzeSentiment(comment) : null,
  }
  store.responses.unshift(response)
  persistBestEffort('addResponse', () => createResponse(response))
  return response
}