<script setup>
import { computed } from 'vue'
import { getIllustration } from '../illustrations'

const props = defineProps({
  illustration: { type: String, required: true },
  theme: { type: String, default: 'credit' },
  size: { type: Number, default: 200 },
  alt: { type: String, default: 'illustration' },
})

const src = computed(() => getIllustration(props.illustration, props.theme))
</script>

<template>
  <img :src="src" :alt="alt" :width="size" :height="size" loading="eager" />
</template>
