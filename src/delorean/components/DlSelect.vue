<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import DlIcon from './DlIcon.vue'

const props = defineProps({
  modelValue: { type: [String, Number], default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: 'Selecciona' },
  options: { type: Array, required: true },
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const root = ref(null)

const selected = computed(() => props.options.find((option) => option.value === props.modelValue))

function pick(option) {
  emit('update:modelValue', option.value)
  open.value = false
}

function onDocumentClick(event) {
  if (root.value && !root.value.contains(event.target)) open.value = false
}

onMounted(() => document.addEventListener('click', onDocumentClick))
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick))
</script>

<template>
  <div ref="root" class="Select">
    <button type="button" class="Select__input" @click="open = !open">
      <span v-if="!selected" class="Select__input__placeholder">{{ placeholder }}</span>
      <span v-else class="Select__selectedOption">
        <p v-if="label">{{ label }}</p>
        <span>{{ selected.label }}</span>
      </span>
      <DlIcon name="chevron" :class="open ? 'Select__chevron--open' : 'Select__chevron--close'" />
    </button>

    <div v-if="open" class="Select__menuDropdown">
      <ul>
        <li v-for="option in options" :key="option.value">
          <button type="button" class="Select__menuDropdown__item dl-body-r" @click="pick(option)">
            {{ option.label }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.Select {
  position: relative;
}
.Select__input {
  font: 400 0.875rem/1.125rem Inter, sans-serif;
  border: 1px solid #a8a8a8;
  border-radius: 12px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  height: 56px;
  cursor: pointer;
  background: #ffffff;
}
.Select__input__placeholder {
  font: 700 0.875rem/1.125rem Inter, sans-serif;
  color: #6f6f6f;
}
.Select__input > svg {
  color: var(--delorean-style-color-primary800);
  flex-shrink: 0;
}
.Select__chevron--open {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
.Select__chevron--close {
  transform: rotate(0);
  transition: transform 0.3s;
}
.Select__selectedOption {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.Select__selectedOption > p {
  font: 600 0.75rem/1rem Inter, sans-serif;
  color: var(--delorean-style-color-primary800);
  margin: 0;
}
.Select__selectedOption > span {
  font: 400 0.875rem/1.125rem Inter, sans-serif;
  color: #161616;
}
.Select__menuDropdown {
  width: 100%;
  border: 1px solid #e0e0e0;
  background: #ffffff;
  border-radius: 24px;
  position: absolute;
  z-index: 20;
  max-height: 280px;
  margin-top: 8px;
}
.Select__menuDropdown > ul {
  list-style: none;
  padding: 0;
  margin: 16px 8px 24px;
  overflow-y: auto;
  max-height: 240px;
}
.Select__menuDropdown__item {
  padding: 16px 12px;
  width: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  text-align: left;
}
.Select__menuDropdown__item:hover {
  background: var(--delorean-style-color-primary100);
}
.Select__menuDropdown__item:active {
  background: #b3f2d9;
}
</style>
