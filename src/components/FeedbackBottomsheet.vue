<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { DlButton, DlChip, DlIllustration, DlSheetGeneric, DlSheetGrade, DlTextArea } from '../delorean'
import { analyzeCsatComment, shouldAnalyzeComment, shouldCollectOpenText, skippedAiFields } from '../ai/csatAgent'
import { addResponse } from '../store'

const props = defineProps({
  open: { type: Boolean, default: false },
  contained: { type: Boolean, default: false },
  config: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const step = ref('rating')
const form = reactive({
  stars: 0,
  pills: [],
  comment: '',
})

const submitting = ref(false)
const totalSteps = computed(() => (shouldCollectOpenText(form.stars) ? 3 : 2))
const stepNumber = computed(() => ({ rating: 1, categories: 2, comment: 3 }[step.value] || totalSteps.value))

function continueFromCategories() {
  if (shouldCollectOpenText(form.stars)) step.value = 'comment'
  else submit()
}

watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return
    step.value = 'rating'
    form.stars = 0
    form.pills = []
    form.comment = ''
    submitting.value = false
  },
)

function togglePill(pill) {
  const index = form.pills.indexOf(pill)
  if (index >= 0) form.pills.splice(index, 1)
  else form.pills.push(pill)
}

function close() {
  emit('close')
}

function selectStars(stars) {
  form.stars = stars
  window.setTimeout(() => {
    if (props.open && step.value === 'rating') step.value = 'categories'
  }, 350)
}

async function submit() {
  if (!props.config || !form.stars || submitting.value) return

  const comment = shouldCollectOpenText(form.stars) ? form.comment.trim() : ''
  submitting.value = true

  let aiFields = skippedAiFields()
  if (shouldAnalyzeComment(form.stars, comment)) {
    try {
      const insight = await analyzeCsatComment(comment)
      aiFields = {
        ai_status: 'done',
        ai_tags: insight.tags,
        ai_problem_text: insight.problem_text,
        ai_error: null,
        ai_processed_at: new Date().toISOString(),
      }
    } catch (error) {
      aiFields = {
        ai_status: 'error',
        ai_tags: null,
        ai_problem_text: null,
        ai_error: error instanceof Error ? error.message : 'No se pudo analizar el comentario.',
        ai_processed_at: new Date().toISOString(),
      }
    }
  }

  addResponse(props.config, {
    stars: form.stars,
    pills: [...form.pills],
    comment,
    ...aiFields,
  })
  submitting.value = false
  step.value = 'thanks'
  window.setTimeout(close, 2000)
}
</script>

<template>
  <DlSheetGeneric :show="open" :show-close="step !== 'thanks'" :contained="contained" @close="close">
    <div v-if="config && step !== 'thanks'" class="max-h-[560px] min-h-[310px] overflow-y-auto">
      <div class="mb-dl24 pr-dl48">
        <p class="dl-caption-sb text-primary-800">{{ config.ratingName }}</p>
        <div class="mt-dl8 flex gap-dl4">
          <span
            v-for="number in totalSteps"
            :key="number"
            class="h-1 flex-1 rounded-full"
            :class="number <= stepNumber ? 'bg-primary-700' : 'bg-grey-200'"
          />
        </div>
      </div>

      <Transition name="step-slide" mode="out-in">
        <div v-if="step === 'rating'" key="rating">
          <DlSheetGrade
            :model-value="form.stars"
            :title="config.welcomeTitle"
            :description="config.q1Label"
            :illustration-model="{ illustration: 'handHighFive', theme: 'credit' }"
            left-label="Difícil"
            right-label="Fácil"
            @update:model-value="selectStars"
          />
          <p class="mt-dl16 text-center dl-caption-r text-grey-500">
            Selecciona una estrella para continuar.
          </p>
        </div>

        <div v-else-if="step === 'categories'" key="categories">
          <p class="dl-title1 text-grey-1000">{{ config.q2Label }}</p>
          <p class="mt-dl8 dl-body-r text-grey-600">Puedes seleccionar más de una opción.</p>
          <div class="mt-dl24 flex flex-wrap gap-dl12">
            <DlChip
              v-for="pill in config.pills"
              :key="pill"
              :text="pill"
              :active="form.pills.includes(pill)"
              @click="togglePill(pill)"
            />
          </div>

          <div class="mt-dl32 flex gap-dl8">
            <DlButton variant="secondary" size="large" :disabled="submitting" @click="step = 'rating'">Atrás</DlButton>
            <DlButton fill size="large" :disabled="submitting" @click="continueFromCategories">
              {{ shouldCollectOpenText(form.stars) ? 'Continuar' : submitting ? 'Enviando...' : 'Enviar calificación' }}
            </DlButton>
          </div>
        </div>

        <div v-else key="comment">
          <p class="dl-title1 text-grey-1000">{{ config.q3Label }}</p>
          <p class="mt-dl8 dl-body-r text-grey-600">Tu comentario es opcional.</p>
          <div class="mt-dl24">
            <DlTextArea
              v-model="form.comment"
              label="Comentario"
              placeholder="Escribe aquí tu comentario"
              :max-length="100"
              :rows="4"
            />
          </div>

          <div class="mt-dl24 flex gap-dl8">
            <DlButton variant="secondary" size="large" :disabled="submitting" @click="step = 'categories'">Atrás</DlButton>
            <DlButton fill size="large" :disabled="submitting" @click="submit">
              {{ submitting ? 'Enviando...' : 'Enviar calificación' }}
            </DlButton>
          </div>
        </div>
      </Transition>
    </div>

    <div v-else-if="step === 'thanks'" class="flex flex-col items-center justify-center py-dl32 text-center">
      <div class="check-pop">
        <DlIllustration illustration="celebration" theme="credit" :size="140" alt="Gracias" />
      </div>
      <p class="dl-font-f37 mt-dl16 text-[1.5rem] font-bold leading-tight text-primary-1000">
        ¡Gracias por tus comentarios!
      </p>
      <p class="mt-dl8 dl-body-r text-grey-600">Tu calificación ya quedó registrada.</p>
    </div>
  </DlSheetGeneric>
</template>

<style scoped>
.step-slide-enter-active,
.step-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.step-slide-enter-from {
  opacity: 0;
  transform: translateX(18px);
}
.step-slide-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}
</style>
