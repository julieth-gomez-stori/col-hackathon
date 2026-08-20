export const defaultConfig = {
  id: 'form-payment-success',
  ratingName: 'Pago Exitoso',
  description: 'Evalúa la experiencia del usuario después de completar un pago.',
  eventName: 'payment_success',
  product: 'Credit',
  owner: 'Julieth Gómez',
  formVersion: '1.0.0',
  frequency: { mode: 'always', value: 1, unit: 'months' },
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
  owner: 'Equipo Secure Card',
  formVersion: '1.1.0',
  frequency: { mode: 'times', value: 3, unit: 'months' },
  pills: ['Rapidez', 'Claridad', 'Seguridad', 'App'],
}

function daysAgo(n, hour = 12) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  d.setHours(hour, 10 + n, 0, 0)
  return d.toISOString()
}

export function seedForms() {
  return [
    { ...defaultConfig, pills: [...defaultConfig.pills] },
    { ...secondConfig, pills: [...secondConfig.pills] },
  ]
}

export function seedResponses() {
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
      sentiment: { label: 'positivo', score: 1 },
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
      sentiment: { label: 'neutral', score: 0 },
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
      sentiment: { label: 'negativo', score: -1 },
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
      sentiment: null,
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
      sentiment: { label: 'negativo', score: -1 },
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
      sentiment: { label: 'positivo', score: 1 },
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
      sentiment: { label: 'negativo', score: -1 },
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
      sentiment: { label: 'positivo', score: 1 },
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
      sentiment: { label: 'positivo', score: 1 },
    },
  ]
}
