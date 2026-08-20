<script setup>
import DlIcon from './DlIcon.vue'
import DlOverlay from './DlOverlay.vue'

defineProps({
  show: { type: Boolean, required: true },
  contentPosition: { type: String, default: 'bottom' },
  showClose: { type: Boolean, default: true },
  contained: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
</script>

<template>
  <DlOverlay :show="show" :content-position="contentPosition" :contained="contained" @close="emit('close')">
    <div class="SheetGeneric">
      <button v-if="showClose" class="SheetGeneric__close" aria-label="close" @click.prevent="emit('close')">
        <DlIcon name="close-bold" />
      </button>
      <slot />
    </div>
  </DlOverlay>
</template>

<style>
.SheetGeneric {
  padding: 24px 16px;
  border-radius: 24px;
  background: #ffffff;
  width: 100%;
  position: relative;
}
.SheetGeneric__close {
  background: #f4f4f4;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  position: absolute;
  top: 24px;
  right: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #161616;
}
.SheetGeneric__close > svg {
  width: 16px;
  height: 16px;
}
</style>
