<script setup>
defineProps({
  text: { type: String, required: true },
  active: { type: Boolean, default: false },
})
</script>

<template>
  <button class="Chip" :class="{ 'Chip--active': active }" type="button">
    <span class="Chip__text">{{ text }}</span>
  </button>
</template>

<style>
.Chip {
  padding: 8px 16px;
  background-color: transparent;
  margin: 0;
  border-radius: 100px;
  border: 1px solid #c6c6c6;
  width: fit-content;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.Chip__text {
  font: 600 0.75rem/1rem Inter, sans-serif;
  color: #393939;
}
.Chip:hover {
  background: #e0e0e0;
}
.Chip:active {
  background: #c6c6c6;
}
.Chip--active,
.Chip--active:hover,
.Chip--active:active {
  background: var(--delorean-style-color-grey200);
  border: none;
}
</style>
