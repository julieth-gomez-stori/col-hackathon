<script setup>
defineProps({
  show: { type: Boolean, required: true },
  contentPosition: {
    type: String,
    default: 'bottom',
    validator: (value) => ['bottom', 'center', 'top'].includes(value),
  },
  hasOpacity: { type: Boolean, default: true },
  /* Solo para el simulador: ancla el overlay al marco del teléfono en vez del viewport. */
  contained: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body" :disabled="contained">
    <div
      v-if="show"
      class="Overlay"
      :class="[`Overlay--${contentPosition}`, { 'Overlay--contained': contained }]"
    >
      <Transition name="dl-backdrop" appear>
        <button
          class="Overlay__backdrop"
          :class="{ 'Overlay__backdrop--transparent': hasOpacity }"
          aria-label="cerrar modal"
          @click.prevent="emit('close')"
        />
      </Transition>

      <Transition :name="contentPosition === 'bottom' ? 'dl-sheet' : 'dl-fade'" appear>
        <div class="Overlay__content">
          <slot />
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style>
.Overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
}
.Overlay--contained {
  position: absolute;
  z-index: 10;
}
.Overlay--center {
  align-items: center;
}
.Overlay--bottom {
  align-items: flex-end;
}
.Overlay--top {
  align-items: flex-start;
}
.Overlay__backdrop {
  position: absolute;
  inset: 0;
  background-color: var(--delorean-style-color-primary1000);
  border: none;
  padding: 0;
  margin: 0;
  z-index: 1001;
  cursor: pointer;
}
.Overlay__backdrop--transparent {
  opacity: 0.85;
}
.Overlay__content {
  position: relative;
  width: 100%;
  z-index: 1002;
  display: flex;
}

.dl-backdrop-enter-active,
.dl-backdrop-leave-active {
  transition: opacity 0.3s ease;
}
.dl-backdrop-enter-from,
.dl-backdrop-leave-to {
  opacity: 0 !important;
}

.dl-sheet-enter-active,
.dl-sheet-leave-active {
  transition: transform 0.38s cubic-bezier(0.32, 0.72, 0, 1);
}
.dl-sheet-enter-from,
.dl-sheet-leave-to {
  transform: translateY(100%);
}

.dl-fade-enter-active,
.dl-fade-leave-active {
  transition: opacity 0.25s ease;
}
.dl-fade-enter-from,
.dl-fade-leave-to {
  opacity: 0;
}
</style>
