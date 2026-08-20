<script setup>
import { computed, reactive, ref } from 'vue'
import { DlButton, DlChip, DlSelect, DlTextArea, DlTextInput, DlTag } from '../delorean'
import { FREQUENCIES, PRODUCTS, defaultConfig, saveForm, store } from '../store'
import PhonePreview from './PhonePreview.vue'

const productOptions = PRODUCTS.map((product) => ({ value: product, label: product }))
const frequencyOptions = FREQUENCIES.map(({ value, label }) => ({ value, label }))

const editorOpen = ref(false)
const newPill = ref('')
const savedFlash = ref(false)
const draft = reactive(createDraft())

function createDraft(form = {}) {
  return {
    ...defaultConfig,
    ...form,
    id: form.id || '',
    pills: [...(form.pills || defaultConfig.pills)],
  }
}

function setDraft(form = {}) {
  Object.assign(draft, createDraft(form))
  newPill.value = ''
  editorOpen.value = true
}

const canSave = computed(
  () =>
    draft.ratingName.trim() &&
    draft.description.trim() &&
    draft.eventName.trim() &&
    draft.welcomeTitle.trim() &&
    draft.q1Label.trim(),
)

function addPill() {
  const value = newPill.value.trim()
  if (!value || draft.pills.includes(value)) return
  draft.pills.push(value)
  newPill.value = ''
}

function removePill(index) {
  draft.pills.splice(index, 1)
}

function persist() {
  if (!canSave.value) return
  const saved = saveForm(draft)
  Object.assign(draft, createDraft(saved))
  savedFlash.value = true
  window.setTimeout(() => {
    savedFlash.value = false
    editorOpen.value = false
  }, 1200)
}

function frequencyLabel(value) {
  return FREQUENCIES.find((item) => item.value === value)?.label || value
}
</script>

<template>
  <section class="space-y-dl24">
    <div class="rounded-dl24 bg-grey-0 p-dl24">
      <div class="flex flex-wrap items-start justify-between gap-dl16">
        <div>
          <p class="dl-caption-sb text-primary-800">Vista Product Lead</p>
          <h1 class="mt-dl4 dl-h1-sb text-grey-1000">Formularios de calificación</h1>
          <p class="mt-dl8 dl-body-r text-grey-600">
            Configura qué encuesta se dispara para cada evento de producto.
          </p>
        </div>
        <DlButton size="large" @click="setDraft()">Agregar formulario</DlButton>
      </div>

      <div class="mt-dl24 overflow-x-auto rounded-dl16 border border-grey-200">
        <table class="min-w-[820px] w-full text-left">
          <thead class="bg-grey-100">
            <tr class="dl-caption-sb text-grey-600">
              <th class="px-dl16 py-dl12">Calificación</th>
              <th class="px-dl16 py-dl12">Evento</th>
              <th class="px-dl16 py-dl12">Producto</th>
              <th class="px-dl16 py-dl12">Frecuencia</th>
              <th class="px-dl16 py-dl12 text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-grey-200">
            <tr v-for="form in store.forms" :key="form.id" class="dl-body-r text-grey-800">
              <td class="px-dl16 py-dl16">
                <p class="dl-body-b text-grey-1000">{{ form.ratingName }}</p>
                <p class="mt-dl4 max-w-[260px] dl-caption-r text-grey-600">{{ form.description }}</p>
              </td>
              <td class="px-dl16 py-dl16">
                <code class="rounded-dl8 bg-grey-100 px-dl8 py-dl4 dl-caption-sb text-primary-800">
                  {{ form.eventName }}
                </code>
              </td>
              <td class="px-dl16 py-dl16"><DlTag :text="form.product" /></td>
              <td class="max-w-[210px] px-dl16 py-dl16 dl-caption-r text-grey-700">
                {{ frequencyLabel(form.frequency) }}
              </td>
              <td class="px-dl16 py-dl16 text-right">
                <DlButton variant="tertiary" size="small" @click="setDraft(form)">Editar</DlButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="editorOpen" class="grid gap-dl24 lg:grid-cols-[1fr_360px]">
      <div class="rounded-dl24 bg-grey-0 p-dl24">
        <div class="flex items-start justify-between gap-dl16">
          <div>
            <p class="dl-caption-sb text-primary-800">{{ draft.id ? 'Editar formulario' : 'Nuevo formulario' }}</p>
            <h2 class="mt-dl4 dl-h2-sb text-grey-1000">
              {{ draft.id ? draft.ratingName : 'Configura la calificación' }}
            </h2>
          </div>
          <DlButton variant="tertiary" size="small" @click="editorOpen = false">Cerrar</DlButton>
        </div>

        <form class="mt-dl24 grid gap-dl24" @submit.prevent="persist">
          <div class="grid gap-dl16 sm:grid-cols-2">
            <DlTextInput v-model="draft.ratingName" label="Nombre de la calificación" placeholder="Pago Exitoso" />
            <DlTextInput v-model="draft.eventName" label="Evento técnico" placeholder="payment_success" />
          </div>

          <DlTextArea
            v-model="draft.description"
            label="Descripción"
            placeholder="Explica qué mide y cuándo aparece esta calificación."
            :rows="2"
          />

          <div class="grid gap-dl16 sm:grid-cols-2">
            <DlSelect v-model="draft.product" label="Producto" :options="productOptions" />
            <DlSelect v-model="draft.frequency" label="Frecuencia de apertura" :options="frequencyOptions" />
          </div>

          <div class="border-t border-grey-200 pt-dl24">
            <p class="dl-title2 text-grey-1000">Contenido del bottomsheet</p>
          </div>

          <DlTextInput
            v-model="draft.welcomeTitle"
            label="Título de bienvenida"
            placeholder="Tu opinión nos ayuda a mejorar"
          />
          <DlTextInput
            v-model="draft.q1Label"
            label="Pregunta 1 · Estrellas"
            placeholder="¿Cómo calificas tu experiencia?"
          />
          <DlTextInput
            v-model="draft.q2Label"
            label="Pregunta 2 · Píldoras"
            placeholder="¿Qué podríamos mejorar?"
          />

          <div>
            <p class="dl-caption-sb text-primary-800">Opciones de píldoras</p>
            <div class="mt-dl12 flex flex-wrap items-center gap-dl8">
              <DlChip
                v-for="(pill, index) in draft.pills"
                :key="pill"
                :text="pill"
                active
                @click="removePill(index)"
              />
            </div>
            <div class="mt-dl12 flex items-start gap-dl8">
              <div class="flex-1">
                <DlTextInput v-model="newPill" placeholder="Agregar etiqueta" @keydown.enter.prevent="addPill" />
              </div>
              <DlButton variant="secondary" size="large" @click="addPill">Agregar</DlButton>
            </div>
          </div>

          <DlTextArea
            v-model="draft.q3Label"
            label="Pregunta 3 · Texto abierto"
            help-text="La respuesta del usuario tendrá máximo 100 caracteres."
            :rows="2"
          />

          <div class="flex flex-wrap items-center gap-dl16">
            <DlButton size="large" :disabled="!canSave" type="submit">
              {{ draft.id ? 'Guardar cambios' : 'Crear formulario' }}
            </DlButton>
            <p v-if="savedFlash" class="dl-body-b text-primary-800">Formulario guardado.</p>
          </div>
        </form>
      </div>

      <PhonePreview :config="draft" />
    </div>
  </section>
</template>
