<script setup>
defineProps({
  text: { type: String, required: true },
  variant: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'alert'].includes(value),
  },
})
</script>

<template>
  <div class="Tag" :class="`Tag--${variant}`">
    <span>{{ text }}</span>
  </div>
</template>

<style>
.Tag {
  font: 400 0.75rem/1rem Inter, sans-serif;
  width: fit-content;
  max-height: 24px;
  background-color: transparent;
  color: #161616;
  padding: 4px 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 8px;
  border-radius: 24px;
}
.Tag > span {
  text-wrap: nowrap;
}
.Tag--success {
  background-color: #b3f2d9;
}
.Tag--error {
  background-color: #ffe0e0;
}
.Tag--alert {
  background-color: #fff3d9;
}
</style>
