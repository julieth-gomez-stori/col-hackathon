<script setup>
import { onMounted, ref } from 'vue'
import { fetchGeminiStatus } from './ai/csatAgent'
import { DlBrand, DlSegmentControl, DlSelect, DlTag, ThemeProvider } from './delorean'
import FormBuilder from './components/FormBuilder.vue'
import MobileSimulator from './components/MobileSimulator.vue'
import ResultsDashboard from './components/ResultsDashboard.vue'

const views = [
  { value: 'admin', label: 'Admin / Creador' },
  { value: 'mobile', label: 'Simulador App' },
  { value: 'dashboard', label: 'Dashboard' },
]

const themes = [
  { value: 'credit-theme', label: 'Credit' },
  { value: 'deposits-theme', label: 'Deposits' },
  { value: 'black-theme', label: 'Black' },
]

const currentView = ref('admin')
const theme = ref('credit-theme')
const geminiReady = ref(null)

onMounted(async () => {
  try {
    geminiReady.value = await fetchGeminiStatus()
  } catch {
    geminiReady.value = false
  }
})
</script>

<template>
  <ThemeProvider :theme="theme">
    <div class="min-h-screen bg-grey-100">
      <header class="sticky top-0 z-30 border-b border-grey-200 bg-grey-0">
        <div class="mx-auto flex max-w-7xl flex-col gap-dl16 px-dl16 py-dl12 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex items-center gap-dl16">
            <DlBrand class="text-primary-1000" :height="26" />
            <div class="border-l border-grey-200 pl-dl16">
              <p class="dl-title2 text-grey-1000">CSAT Bendita entre los hombres</p>
              <p class="dl-caption-r text-grey-600">Design System · MVP parametrizable</p>
              <div class="mt-dl8">
                <DlTag
                  :text="geminiReady ? 'Gemini listo' : geminiReady === null ? 'Comprobando Gemini...' : 'Falta GEMINI_API_KEY'"
                  :variant="geminiReady ? 'success' : 'alert'"
                />
              </div>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-dl16">
            <DlSegmentControl v-model="currentView" :items="views" />
            <div class="w-[150px]">
              <DlSelect v-model="theme" label="Tema" :options="themes" />
            </div>
          </div>
        </div>
      </header>

      <main class="mx-auto max-w-7xl px-dl16 py-dl24">
        <Transition name="view" mode="out-in">
          <FormBuilder v-if="currentView === 'admin'" key="admin" />
          <MobileSimulator v-else-if="currentView === 'mobile'" key="mobile" />
          <ResultsDashboard v-else key="dashboard" />
        </Transition>
      </main>
    </div>
  </ThemeProvider>
</template>
