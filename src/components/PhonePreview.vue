<script setup>
import { DlBrand, DlButton, DlChip, DlIcon, DlSheetGrade } from '../delorean'

defineProps({
  config: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <aside class="lg:sticky lg:top-28">
    <p class="mb-dl8 dl-caption-sb text-grey-600">Vista previa</p>

    <div class="mx-auto w-[320px] overflow-hidden rounded-[2rem] bg-grey-0 shadow-[0_20px_60px_rgba(0,58,64,0.18)]">
      <div class="flex items-center justify-between border-b border-grey-200 px-dl16 py-dl12">
        <DlBrand class="text-primary-1000" :height="22" />
        <DlIcon name="close-bold" class="h-4 w-4 text-primary-1000" />
      </div>

      <div class="relative min-h-[560px] bg-grey-0">
        <div class="px-dl16 pt-dl24 opacity-30">
          <p class="dl-font-f37 text-center text-[1.5rem] font-bold leading-tight text-primary-1000">
            {{ config.eventName }}
          </p>
          <p class="mt-dl8 text-center dl-body-r text-grey-600">{{ config.product }}</p>
        </div>

        <div class="absolute inset-x-0 bottom-0 rounded-t-dl24 bg-grey-0 p-dl16 shadow-[0_-8px_30px_rgba(0,58,64,0.12)]">
          <DlSheetGrade
            :title="config.welcomeTitle"
            :description="config.q1Label"
            :illustration-model="{ illustration: 'handHighFive', theme: 'credit' }"
            :model-value="0"
          />

          <p class="mt-dl16 dl-body-b text-grey-1000">{{ config.q2Label }}</p>
          <div class="mt-dl8 flex flex-wrap gap-dl8">
            <DlChip v-for="pill in config.pills" :key="pill" :text="pill" />
          </div>

          <p class="mt-dl16 dl-caption-sb text-primary-800">{{ config.q3Label }}</p>
          <div class="mt-dl4 h-14 rounded-dl12 border border-grey-400" />

          <div class="mt-dl16">
            <DlButton fill>Enviar calificación</DlButton>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>
