<script setup>
defineProps({
  theme: {
    type: String,
    default: 'credit-theme',
    validator: (value) => ['credit-theme', 'deposits-theme', 'black-theme'].includes(value),
  },
})
</script>

<template>
  <div :class="theme">
    <slot />
  </div>
</template>
