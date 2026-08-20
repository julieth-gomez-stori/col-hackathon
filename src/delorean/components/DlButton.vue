<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'tertiary'].includes(value),
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
  fill: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  type: { type: String, default: 'button' },
})

const classes = computed(() => [
  'Button',
  `Button--${props.variant}`,
  `Button--${props.size}`,
  { 'Button--fill': props.fill },
])
</script>

<template>
  <button :class="classes" :disabled="disabled" :type="type">
    <slot />
  </button>
</template>

<style>
.Button {
  font: 700 0.875rem/1.125rem Inter, sans-serif;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.Button--small {
  padding: 4px 12px;
  height: 40px;
  column-gap: 4px;
}
.Button--medium {
  padding: 8px 16px;
  height: 48px;
  column-gap: 8px;
}
.Button--large {
  padding: 12px 24px;
  height: 56px;
  column-gap: 8px;
}
.Button--primary {
  background: var(--delorean-style-color-primary700);
  color: #161616;
}
.Button--primary:hover {
  background: var(--delorean-style-color-primary500);
}
.Button--primary:active {
  background: var(--delorean-style-color-primary800);
}
.Button--primary:disabled,
.Button--primary:disabled:hover,
.Button--primary:disabled:active {
  background: #e0e0e0;
  color: #a8a8a8;
  cursor: not-allowed;
}
.Button--secondary {
  background: #f4f4f4;
  color: #161616;
}
.Button--secondary:hover {
  background: var(--delorean-style-color-primary200);
}
.Button--secondary:active {
  background: var(--delorean-style-color-primary300);
}
.Button--secondary:disabled {
  background: #f4f4f4;
  color: #a8a8a8;
  cursor: not-allowed;
}
.Button--tertiary {
  background: none;
  color: #161616;
  text-decoration: underline;
}
.Button--tertiary:hover {
  background: #f4f4f4;
}
.Button--tertiary:active {
  background: #e0e0e0;
}
.Button--tertiary:disabled {
  color: #a8a8a8;
  cursor: not-allowed;
}
.Button--fill {
  width: 100%;
}
</style>
