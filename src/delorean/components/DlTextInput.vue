<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  helpText: { type: String, default: '' },
  type: { type: String, default: 'text' },
  min: { type: [String, Number], default: undefined },
  max: { type: [String, Number], default: undefined },
  state: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'error', 'success', 'disabled'].includes(value),
  },
})

const emit = defineEmits(['update:modelValue'])

const focused = ref(false)

const classes = computed(() => [
  'TextInputMask',
  { 'TextInputMask--focused': focused.value && props.state === 'default' },
  { 'TextInputMask--error': props.state === 'error' },
  { 'TextInputMask--success': props.state === 'success' },
  { 'TextInputMask--disabled': props.state === 'disabled' },
])
</script>

<template>
  <div class="TextInputWrapper">
    <div :class="classes">
      <label v-if="label">{{ label }}</label>
      <input
        class="TextInput dl-body-r"
        :type="type"
        :min="min"
        :max="max"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="state === 'disabled'"
        @focus="focused = true"
        @blur="focused = false"
        @input="emit('update:modelValue', $event.target.value)"
      />
    </div>
    <span v-if="helpText" class="TextHelp" :class="{ 'TextHelp--error': state === 'error' }">{{ helpText }}</span>
  </div>
</template>

<style>
.TextInputWrapper {
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}
.TextInputMask {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 12px;
  border: 1px solid #a8a8a8;
  min-height: 56px;
  border-radius: 12px;
  background: #ffffff;
}
.TextInputMask > label {
  font: 600 0.75rem/1rem Inter, sans-serif;
  color: var(--delorean-style-color-primary800);
  pointer-events: none;
}
.TextInputMask--focused {
  border-color: var(--delorean-style-color-primary800);
}
.TextInputMask--error {
  border-color: #b90000;
}
.TextInputMask--error > label {
  color: #b90000;
}
.TextInputMask--success {
  border-color: #058e65;
}
.TextInputMask--disabled {
  border-color: #a8a8a8;
  cursor: not-allowed;
}
.TextInput {
  outline: none;
  border: none;
  padding: 0;
  background: transparent;
  color: #161616;
  width: 100%;
}
.TextInput::placeholder {
  font: 700 0.875rem/1.125rem Inter, sans-serif;
  color: #6f6f6f;
}
.TextHelp {
  font: 400 0.75rem/1rem Inter, sans-serif;
  color: #6f6f6f;
}
.TextHelp--error {
  color: #b90000;
}
</style>
