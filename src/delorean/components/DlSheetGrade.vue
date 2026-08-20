<script setup>
import { ref, watch } from 'vue'
import DlIcon from './DlIcon.vue'
import DlIllustration from './DlIllustration.vue'

const props = defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  illustrationModel: {
    type: Object,
    default: () => ({ illustration: '', theme: 'credit' }),
  },
  leftLabel: { type: String, default: 'Difícil' },
  rightLabel: { type: String, default: 'Fácil' },
  modelValue: { type: Number, default: 0 },
})

const emit = defineEmits(['update:modelValue', 'starClick'])

const hovered = ref(0)

watch(
  () => props.modelValue,
  (value) => {
    if (!value) hovered.value = 0
  },
)

function selectStar(star) {
  emit('update:modelValue', star)
  emit('starClick', star)
}
</script>

<template>
  <div class="SheetGrade">
    <DlIllustration
      v-if="illustrationModel.illustration"
      class="SheetGrade__illustration"
      :illustration="illustrationModel.illustration"
      :theme="illustrationModel.theme"
      :size="64"
    />
    <p class="SheetGrade__title">{{ title }}</p>
    <p v-if="description" class="SheetGrade__description">{{ description }}</p>

    <div class="SheetGrade__starsContainer">
      <button
        v-for="star in 5"
        :key="star"
        class="SheetGrade__star"
        :class="{ 'SheetGrade__star--selected': star <= (hovered || modelValue) }"
        :aria-label="`estrella para calificar número ${star}`"
        @click="selectStar(star)"
        @mouseenter="hovered = star"
        @mouseleave="hovered = 0"
      >
        <DlIcon name="favorite" />
      </button>
    </div>

    <div class="SheetGrade__rateLabels">
      <p class="SheetGrade__rateLabels__label">{{ leftLabel }}</p>
      <p class="SheetGrade__rateLabels__label">{{ rightLabel }}</p>
    </div>
  </div>
</template>

<style>
.SheetGrade {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.SheetGrade__illustration {
  margin-bottom: 16px;
}
.SheetGrade__title {
  font: 700 1rem/1.25rem Inter, sans-serif;
  margin: 0;
  color: #161616;
}
.SheetGrade__description {
  font: 400 0.875rem/1.125rem Inter, sans-serif;
  margin: 16px 0 24px;
  color: #393939;
  text-align: center;
}
.SheetGrade__starsContainer {
  display: flex;
  justify-content: center;
  column-gap: 24px;
  margin-bottom: 16px;
}
.SheetGrade__star {
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #c6c6c6;
  transition: color 0.15s ease, transform 0.15s ease;
}
.SheetGrade__star > svg {
  width: 32px;
  height: 32px;
}
.SheetGrade__star--selected {
  color: #8a6c00;
  transform: scale(1.06);
}
.SheetGrade__rateLabels {
  display: flex;
  justify-content: space-between;
  width: 256px;
}
.SheetGrade__rateLabels__label {
  font: 400 0.875rem/1.125rem Inter, sans-serif;
  margin: 0;
  color: #6f6f6f;
}
</style>
