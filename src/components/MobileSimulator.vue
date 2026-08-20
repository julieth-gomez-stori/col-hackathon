<script setup>
import { computed, ref } from 'vue'
import { DlBrand, DlIcon, DlIllustration, DlSelect, DlTag } from '../delorean'
import { frequencyLabel, store } from '../store'
import { frequencyWindowMs, normalizeFrequency } from '../frequency'
import FeedbackBottomsheet from './FeedbackBottomsheet.vue'

const open = ref(false)
const selectedFormId = ref(store.forms[0]?.id || '')
const triggerCounts = ref({})
const lastOpenedAt = ref({})
const simulationMessage = ref('')

const SHORTCUTS = [
  { label: 'Invitar amigo', illustration: 'referalsHand' },
  { label: 'Pago de servicios', illustration: 'billPayment' },
  { label: 'Recargas de Celular', illustration: 'TopUp' },
  { label: 'Puntaje crediticio', illustration: 'ScoreCrediticio' },
  { label: 'Sello diario', illustration: 'Gift' },
  { label: 'Brillo de día', illustration: 'brilloDiario' },
  { label: 'Choque choque', illustration: 'aprietaAprieta01' },
  { label: 'Shein', illustration: 'CouponShein' },
]

const formOptions = computed(() =>
  store.forms.map((form) => ({
    value: form.id,
    label: `${form.ratingName} · ${form.eventName}`,
  })),
)

const selectedForm = computed(
  () => store.forms.find((form) => form.id === selectedFormId.value) || store.forms[0],
)

const selectedFrequencyLabel = computed(() =>
  selectedForm.value ? frequencyLabel(selectedForm.value.frequency) : '',
)

function nextTriggerMessage(frequency, count) {
  const { mode, value } = normalizeFrequency(frequency)
  if (mode === 'times') {
    const remaining = value - (count % value)
    return `Evento ejecutado ${count} veces. La calificación se abrirá en la ejecución ${count + remaining}.`
  }
  return `Evento ejecutado. Ya se mostró esta calificación en el periodo actual (${frequencyLabel(frequency)}).`
}

function simulateEvent() {
  const form = selectedForm.value
  if (!form) return

  const count = (triggerCounts.value[form.id] || 0) + 1
  triggerCounts.value[form.id] = count

  const { mode, value } = normalizeFrequency(form.frequency)
  const lastOpened = lastOpenedAt.value[form.id]

  let shouldOpen = false
  if (mode === 'always') shouldOpen = true
  else if (mode === 'times') shouldOpen = count % value === 0
  else shouldOpen = !lastOpened || Date.now() - lastOpened >= frequencyWindowMs(form.frequency)

  if (shouldOpen) {
    lastOpenedAt.value[form.id] = Date.now()
    simulationMessage.value = `Evento ${form.eventName} ejecutado. Se abre la calificación.`
    open.value = true
    return
  }

  simulationMessage.value = nextTriggerMessage(form.frequency, count)
}

function resetSimulation() {
  triggerCounts.value = {}
  lastOpenedAt.value = {}
  simulationMessage.value = 'Contadores de simulación reiniciados.'
}
</script>

<template>
  <section class="mx-auto max-w-[420px]">
    <div class="mb-dl16 rounded-dl16 bg-grey-0 p-dl16">
      <p class="dl-caption-sb text-primary-800">Simulador de eventos</p>
      <p class="mt-dl4 dl-caption-r text-grey-600">
        Selecciona uno de los formularios creados y ejecuta su evento desde el home.
      </p>

      <div v-if="selectedForm" class="mt-dl16">
        <DlSelect v-model="selectedFormId" label="Formulario / evento" :options="formOptions" />
        <div class="mt-dl12 flex flex-wrap items-center gap-dl8">
          <DlTag :text="selectedForm.product" />
          <span class="dl-caption-r text-grey-600">{{ selectedFrequencyLabel }}</span>
        </div>
        <p class="mt-dl8 dl-caption-r text-grey-600">{{ selectedForm.description }}</p>
        <p class="mt-dl4 dl-caption-r text-grey-500">
          Owner: {{ selectedForm.owner }} · Form v{{ selectedForm.formVersion }}
        </p>

        <div class="mt-dl12 flex items-start justify-between gap-dl12">
          <p class="dl-caption-r text-grey-600">{{ simulationMessage }}</p>
          <button
            type="button"
            class="shrink-0 dl-link-caption text-primary-800 underline"
            @click="resetSimulation"
          >
            Reiniciar
          </button>
        </div>
      </div>
      <p v-else class="mt-dl12 dl-body-r text-grey-600">Crea primero un formulario desde Admin / Creador.</p>
    </div>

    <div class="relative overflow-hidden rounded-[2rem] bg-grey-0 shadow-[0_20px_60px_rgba(0,58,64,0.18)]">
      <div class="flex items-center justify-between px-dl24 pb-dl4 pt-dl12">
        <span class="dl-body-b text-grey-1000">9:41</span>
        <div class="flex items-center gap-dl4 text-grey-1000">
          <svg width="18" height="12" viewBox="0 0 18 12" fill="currentColor" aria-hidden="true">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
            <rect x="10" y="3" width="3" height="9" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
            <path
              d="M8 10.5 5.8 8.3a3.1 3.1 0 0 1 4.4 0zM3.4 5.9a6.5 6.5 0 0 1 9.2 0l1.6-1.6a8.8 8.8 0 0 0-12.4 0z"
              fill="currentColor"
            />
          </svg>
          <svg width="24" height="12" viewBox="0 0 24 12" fill="none" aria-hidden="true">
            <rect x="0.5" y="0.5" width="20" height="11" rx="3" stroke="currentColor" opacity="0.4" />
            <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
            <path d="M22 4v4a2 2 0 0 0 0-4" fill="currentColor" opacity="0.4" />
          </svg>
        </div>
      </div>

      <div class="max-h-[640px] overflow-y-auto pb-dl24">
        <header class="flex items-center justify-between px-dl20 pb-dl16 pt-dl8">
          <p class="dl-h2-sb text-grey-1000">Hola, Fernanda</p>
          <div class="flex items-center gap-dl8">
            <span class="rounded-full bg-grey-100 px-dl12 py-dl8 dl-caption-sb text-grey-1000">Ayuda</span>
            <div class="relative">
              <span class="flex h-9 w-9 items-center justify-center rounded-full bg-grey-100 text-grey-1000">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path
                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8m0 2c-4 0-7 2.2-7 4.6V20h14v-1.4c0-2.4-3-4.6-7-4.6"
                  />
                </svg>
              </span>
              <span class="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#e02020]" />
            </div>
          </div>
        </header>

        <section class="border-t border-grey-200 px-dl20 py-dl16">
          <button type="button" class="flex w-full items-center justify-between text-left">
            <span class="dl-title2 text-grey-1000">Stori Cuenta+</span>
            <DlIcon name="chevron" class="h-5 w-5 -rotate-90 text-grey-1000" />
          </button>
          <p class="mt-dl8 dl-caption-r text-grey-600">Saldo disponible</p>
          <p class="dl-h1-sb text-grey-1000">$21,008.94</p>
          <p class="mt-dl4 dl-caption-r text-grey-600">
            <span aria-hidden="true">↗</span> Rendimiento generado:
            <span class="dl-caption-sb text-primary-800">$248.94</span>
          </p>
          <div class="mt-dl16 grid grid-cols-2 gap-dl12">
            <button type="button" class="rounded-full bg-grey-100 py-dl12 dl-body-b text-grey-1000">
              Depositar
            </button>
            <button type="button" class="rounded-full bg-grey-100 py-dl12 dl-body-b text-grey-1000">
              Transferir
            </button>
          </div>
        </section>

        <section class="border-t border-grey-200 px-dl20 py-dl16">
          <button type="button" class="flex w-full items-center justify-between text-left">
            <span class="dl-title2 text-grey-1000">Tarjeta de crédito</span>
            <DlIcon name="chevron" class="h-5 w-5 -rotate-90 text-grey-1000" />
          </button>
          <div class="mt-dl8 flex items-start justify-between gap-dl12">
            <div>
              <p class="dl-caption-r text-grey-600">Crédito disponible</p>
              <p class="dl-h1-sb text-grey-1000">$4,000.00</p>
              <p class="mt-dl4 dl-caption-r text-grey-600">
                Deuda total: <span class="dl-caption-sb text-grey-1000">$125.00</span>
              </p>
            </div>
            <DlIllustration
              illustration="CreditoFisicaPerspectiva"
              theme="credit"
              :size="72"
              alt="Tarjeta de crédito Stori"
              class="shrink-0"
            />
          </div>
          <div class="mt-dl16 grid grid-cols-2 gap-dl12">
            <button
              type="button"
              class="rounded-full bg-primary-800 py-dl12 dl-body-b text-grey-0 transition active:scale-[0.98] disabled:opacity-50"
              :disabled="!selectedForm"
              @click="simulateEvent"
            >
              Pagar
            </button>
            <button type="button" class="rounded-full bg-grey-100 py-dl12 dl-body-b text-grey-1000">NIP</button>
          </div>
        </section>

        <section class="px-dl20 pt-dl8">
          <p class="dl-title2 text-grey-1000">Haz más con Stori</p>
          <div class="mt-dl16 grid grid-cols-4 gap-x-dl12 gap-y-dl16">
            <button
              v-for="shortcut in SHORTCUTS"
              :key="shortcut.label"
              type="button"
              class="flex flex-col items-center gap-dl8 text-center"
            >
              <span class="flex h-14 w-14 items-center justify-center rounded-dl16 bg-grey-100">
                <DlIllustration
                  :illustration="shortcut.illustration"
                  theme="credit"
                  :size="40"
                  :alt="shortcut.label"
                />
              </span>
              <span class="dl-caption-r leading-tight text-grey-800">{{ shortcut.label }}</span>
            </button>
          </div>
          <div class="mt-dl16 flex items-center justify-center gap-dl4">
            <span class="h-1.5 w-5 rounded-full bg-primary-800" />
            <span class="h-1.5 w-1.5 rounded-full bg-grey-300" />
          </div>
        </section>

        <section class="mt-dl16 px-dl20">
          <div class="flex items-center justify-between overflow-hidden rounded-dl16 bg-primary-1000 pl-dl16">
            <div class="py-dl16">
              <p class="dl-body-b text-grey-0">¡Meses sin intereses!</p>
              <p class="mt-dl4 dl-caption-r text-grey-0 opacity-80">Conoce los comercios</p>
            </div>
            <DlIllustration illustration="Ofertas" theme="credit" :size="88" alt="Meses sin intereses" />
          </div>
        </section>

        <div class="mt-dl24 flex justify-center opacity-40">
          <DlBrand class="text-primary-1000" :height="20" />
        </div>
      </div>

      <FeedbackBottomsheet :open="open" :config="selectedForm" contained @close="open = false" />
    </div>
  </section>
</template>
