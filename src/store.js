import { reactive, watch } from 'vue'

export const PRODUCTS = ['Credit', 'Secure Card', 'Luna', 'Clip', 'Tap2Pay', 'Deposits']
export const APP_VERSIONS = ['3.10.0', '3.11.0', '3.12.0']
export const FREQUENCIES = [
  { value: 'always', label: 'Cada vez que se ejecuta el evento' },
  { value: 'every_3', label: 'Cada 3 veces que se ejecuta el evento' },
  { value: 'monthly', label: 'Una vez al mes' },
]

/* v2: catálogo de formularios y nueva lista de productos. */
const STORAGE_KEY = 'feedback-bottomsheet-mvp-v2'

export const defaultConfig = {
  id: 'form-payment-success',
  ratingName: 'Pago Exitoso',
  description: 'Evalúa la experiencia del usuario después de completar un pago.',
  eventName: 'payment_success',
  product: 'Credit',
  frequency: 'always',
  welcomeTitle: 'Tu opinión nos ayuda a mejorar',
  q1Label: '¿Cómo calificas tu experiencia?',
  q2Label: '¿Qué podríamos mejorar?',
  pills: ['Rapidez', 'Claridad', 'Soporte', 'Comisiones', 'App'],
  q3Label: 'Cuéntanos más detalles...',
  appVersion: '3.12.0',
}

const secondConfig = {
  ...defaultConfig,
  id: 'form-card-activation',
  ratingName: 'Activación de tarjeta',
  description: 'Mide la experiencia al activar una tarjeta segura.',
  eventName: 'card_activation_success',
  product: 'Secure Card',
  frequency: 'every_3',
  pills: ['Rapidez', 'Claridad', 'Seguridad', 'App'],
}

function daysAgo(n, hour = 12) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, 10 + n, 0, 0)
  return d.toISOString()
}

function seedResponses() {
  return [
    {
      id: 'r1',
      createdAt: daysAgo(0, 9),
      formId: 'form-payment-success',
      product: 'Credit',
      appVersion: '3.12.0',
      eventName: 'payment_success',
      stars: 5,
      pills: ['Rapidez'],
      comment: 'El pago se reflejó al instante. Excelente.',
    },
    {
      id: 'r2',
      createdAt: daysAgo(0, 14),
      formId: 'form-payment-success',
      product: 'Credit',
      appVersion: '3.12.0',
      eventName: 'payment_success',
      stars: 4,
      pills: ['Claridad', 'App'],
      comment: 'Todo bien, el comprobante podría ser más claro.',
    },
    {
      id: 'r3',
      createdAt: daysAgo(1, 11),
      formId: 'form-card-activation',
      product: 'Secure Card',
      appVersion: '3.11.0',
      eventName: 'card_activation_success',
      stars: 3,
      pills: ['Comisiones', 'Claridad'],
      comment: 'No entendí del todo las comisiones aplicadas.',
    },
    {
      id: 'r4',
      createdAt: daysAgo(1, 18),
      formId: 'form-payment-success',
      product: 'Tap2Pay',
      appVersion: '3.12.0',
      eventName: 'payment_success',
      stars: 5,
      pills: ['Rapidez', 'App'],
      comment: '',
    },
    {
      id: 'r5',
      createdAt: daysAgo(2, 10),
      formId: 'form-payment-success',
      product: 'Credit',
      appVersion: '3.10.0',
      eventName: 'payment_success',
      stars: 2,
      pills: ['Soporte'],
      comment: 'Tuve que reintentar dos veces el envío.',
    },
    {
      id: 'r6',
      createdAt: daysAgo(3, 16),
      formId: 'form-card-activation',
      product: 'Secure Card',
      appVersion: '3.12.0',
      eventName: 'card_activation_success',
      stars: 4,
      pills: ['App'],
      comment: 'Flujo rápido, me gustaría ver más detalle del rendimiento.',
    },
    {
      id: 'r7',
      createdAt: daysAgo(4, 8),
      formId: 'form-payment-success',
      product: 'Deposits',
      appVersion: '3.11.0',
      eventName: 'payment_success',
      stars: 1,
      pills: ['Soporte', 'Claridad'],
      comment: 'El mensaje de error no me dijo qué falló.',
    },
    {
      id: 'r8',
      createdAt: daysAgo(5, 13),
      formId: 'form-payment-success',
      product: 'Credit',
      appVersion: '3.12.0',
      eventName: 'payment_success',
      stars: 5,
      pills: ['Rapidez'],
      comment: 'Súper sencillo.',
    },
    {
      id: 'r9',
      createdAt: daysAgo(6, 19),
      formId: 'form-card-activation',
      product: 'Luna',
      appVersion: '3.10.0',
      eventName: 'card_activation_success',
      stars: 4,
      pills: ['Claridad'],
      comment: 'Buena confirmación al finalizar.',
    },
  ]
}

function seedForms() {
  return [
    { ...defaultConfig, pills: [...defaultConfig.pills] },
    { ...secondConfig, pills: [...secondConfig.pills] },
  ]
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { forms: seedForms(), responses: seedResponses() }

    const parsed = JSON.parse(raw)
    const forms = Array.isArray(parsed.forms) && parsed.forms.length ? parsed.forms : seedForms()

    return {
      forms: forms.map((form) => ({
        ...defaultConfig,
        ...form,
        pills: form.pills?.length ? form.pills : [...defaultConfig.pills],
      })),
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

export function saveForm(next) {
  const form = {
    ...defaultConfig,
    ...next,
    id: next.id || `form-${Date.now()}`,
    pills: [...next.pills],
  }
  const index = store.forms.findIndex((item) => item.id === form.id)
  if (index >= 0) Object.assign(store.forms[index], form)
  else store.forms.unshift(form)
  return form
}

export function addResponse(form, payload) {
  store.responses.unshift({
    id: `r-${Date.now()}`,
    createdAt: new Date().toISOString(),
    formId: form.id,
    product: form.product,
    appVersion: form.appVersion,
    eventName: form.eventName,
    ...payload,
  })
}