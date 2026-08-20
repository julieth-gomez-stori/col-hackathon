<script setup>
import { computed, ref } from 'vue'
import { DlBrand, DlButton, DlIcon, DlIllustration, DlSelect, DlTag } from '../delorean'
import { FREQUENCIES, store } from '../store'
import FeedbackBottomsheet from './FeedbackBottomsheet.vue'

const open = ref(false)
const selectedFormId = ref(store.forms[0]?.id || '')
const triggerCounts = ref({})
const monthlyOpened = ref({})
const simulationMessage = ref('')

const formOptions = computed(() =>
  store.forms.map((form) => ({
    value: form.id,
    label: `${form.ratingName} · ${form.eventName}`,
  })),
)

const selectedForm = computed(
  () => store.forms.find((form) => form.id === selectedFormId.value) || store.forms[0],
)

const frequencyLabel = computed(
  () => FREQUENCIES.find((item) => item.value === selectedForm.value?.frequency)?.label || '',
)

function simulateEvent() {
  const form = selectedForm.value
  if (!form) return

  const count = (triggerCounts.value[form.id] || 0) + 1
  triggerCounts.value[form.id] = count
  const monthKey = new Date().toISOString().slice(0, 7)
  const monthlyKey = `${form.id}:${monthKey}`

  const shouldOpen =
    form.frequency === 'always' ||
    (form.frequency === 'every_3' && count % 3 === 0) ||
    (form.frequency === 'monthly' && !monthlyOpened.value[monthlyKey])

  if (shouldOpen) {
    if (form.frequency === 'monthly') monthlyOpened.value[monthlyKey] = true
    simulationMessage.value = `Evento ${form.eventName} ejecutado. Se abre la calificación.`
    open.value = true
  } else if (form.frequency === 'every_3') {
    simulationMessage.value = `Evento ejecutado ${count} veces. La calificación se abrirá en la ejecución ${count + (3 - (count % 3))}.`
  } else {
    simulationMessage.value = 'Evento ejecutado. Esta calificación ya se mostró durante el mes actual.'
  }
}

function resetSimulation() {
  triggerCounts.value = {}
  monthlyOpened.value = {}
  simulationMessage.value = 'Contadores de simulación reiniciados.'
}
</script>

<template>
  <section class="mx-auto max-w-[420px]">
    <div class="mb-dl16 rounded-dl16 bg-grey-0 p-dl16">
      <p class="dl-caption-sb text-primary-800">Simulador de eventos</p>
      <p class="mt-dl4 dl-caption-r text-grey-600">Selecciona uno de los formularios creados y ejecuta su evento.</p>

      <div v-if="selectedForm" class="mt-dl16">
        <DlSelect v-model="selectedFormId" label="Formulario / evento" :options="formOptions" />
        <div class="mt-dl12 flex flex-wrap items-center gap-dl8">
          <DlTag :text="selectedForm.product" />
          <span class="dl-caption-r text-grey-600">{{ frequencyLabel }}</span>
        </div>
        <p class="mt-dl8 dl-caption-r text-grey-600">{{ selectedForm.description }}</p>

        <div class="mt-dl16">
          <DlButton fill variant="secondary" @click="simulateEvent">
            Ejecutar {{ selectedForm.eventName }}
          </DlButton>
        </div>
        <div class="mt-dl8 flex items-start justify-between gap-dl12">
          <p class="dl-caption-r text-grey-600">{{ simulationMessage }}</p>
          <button type="button" class="shrink-0 dl-link-caption text-primary-800 underline" @click="resetSimulation">
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

      <header class="flex items-center justify-between border-b border-grey-200 px-dl16 py-dl16">
        <DlBrand class="text-primary-1000" :height="28" />
        <button class="text-primary-1000" aria-label="Cerrar" type="button">
          <DlIcon name="close-bold" class="h-5 w-5" />
        </button>
      </header>

      <div class="flex min-h-[620px] flex-col px-dl24 pb-dl24 pt-dl32">
        <h1 class="dl-font-f37 text-center text-[2rem] font-bold leading-[1.15] text-primary-1000">
          ¡Tu oferta está casi lista!
        </h1>

        <p class="mx-auto mt-dl16 max-w-[300px] text-center text-base leading-6 text-grey-700">
          Aprovecha este momento para invitar a tus amigos a Stori. Gracias a ti, recibirán una oferta exclusiva.
        </p>

        <div class="flex flex-1 items-center justify-center py-dl24">
          <DlIllustration illustration="referalsHand" theme="credit" :size="230" alt="Invita a tus amigos" />
        </div>

        <DlButton fill size="large" :disabled="!selectedForm" @click="simulateEvent">Invitar a Stori</DlButton>
      </div>

      <FeedbackBottomsheet :open="open" :config="selectedForm" contained @close="open = false" />
    </div>
  </section>
</template>
