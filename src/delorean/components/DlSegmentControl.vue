<script setup>
defineProps({
  modelValue: { type: [String, Number], required: true },
  items: { type: Array, required: true },
  fullWidth: { type: Boolean, default: false },
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="SegmentControl" :class="{ 'SegmentControl--full-width': fullWidth }">
    <button
      v-for="item in items"
      :key="item.value"
      type="button"
      class="SegmentControl__item"
      :class="{ 'SegmentControl__item--selected': item.value === modelValue }"
      @click="emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>

<style>
.SegmentControl {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  border-radius: 100px;
  background-color: #f4f4f4;
  padding: 4px;
  width: fit-content;
}
.SegmentControl__item {
  font: 600 0.75rem/1rem Inter, sans-serif;
  padding: 8px 12px;
  background-color: transparent;
  color: #161616;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  white-space: nowrap;
}
.SegmentControl__item--selected {
  background-color: #ffffff;
}
.SegmentControl--full-width {
  width: auto;
  display: grid;
  grid-auto-flow: column;
}
</style>
