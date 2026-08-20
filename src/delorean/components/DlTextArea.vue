<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  helpText: { type: String, default: '' },
  maxLength: { type: Number, default: undefined },
  rows: { type: Number, default: 3 },
  state: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'error', 'success', 'readonly'].includes(value),
  },
})

const emit = defineEmits(['update:modelValue'])

const focused = ref(false)

const classes = computed(() => [
  'TextArea',
  { 'TextArea--focused': focused.value && props.state === 'default' },
  { 'TextArea--error': props.state === 'error' },
  { 'TextArea--success': props.state === 'success' },
  { 'TextArea--readonly': props.state === 'readonly' },
])
</script>

<template>
  <div :class="classes">
    <label v-if="label" class="TextArea__label">{{ label }}</label>
    <textarea
      class="TextArea__input dl-body-r"
      :value="modelValue"
      :rows="rows"
      :maxlength="maxLength"
      :placeholder="placeholder"
      :readonly="state === 'readonly'"
      @focus="focused = true"
      @blur="focused = false"
      @input="emit('update:modelValue', $event.target.value)"
    />
    <div class="TextArea__info">
      <span v-if="helpText" class="TextArea__help">{{ helpText }}</span>
      <span v-if="maxLength" class="TextArea__counter">{{ modelValue.length }}/{{ maxLength }}</span>
    </div>
  </div>
</template>

<style>
.TextArea {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border: 1px solid #a8a8a8;
  border-radius: 12px;
  background: #ffffff;
}
.TextArea__label {
  font: 600 0.75rem/1rem Inter, sans-serif;
  color: var(--delorean-style-color-primary800);
}
.TextArea__input {
  font-family: inherit;
  border: none;
  resize: none;
  outline: none;
  color: #161616;
  background: transparent;
}
.TextArea__input::placeholder {
  font: 400 0.875rem/1.125rem Inter, sans-serif;
  color: #6f6f6f;
}
.TextArea__info {
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 8px;
}
.TextArea__help,
.TextArea__counter {
  font: 400 0.75rem/1rem Inter, sans-serif;
  color: #6f6f6f;
}
.TextArea__counter {
  margin-left: auto;
}
.TextArea--focused {
  border-color: var(--delorean-style-color-primary800);
}
.TextArea--error {
  border-color: #b90000;
}
.TextArea--success {
  border-color: #058e65;
}
.TextArea--readonly > label {
  color: #6f6f6f;
}
.TextArea--readonly > textarea {
  color: #6f6f6f;
}
</style>
