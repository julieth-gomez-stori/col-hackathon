<script setup>
import { computed, ref } from 'vue'
import { DlChip, DlIcon, DlSelect, DlTag } from '../delorean'
import { CSAT_TAG_KEYS } from '../ai/csatAgent'
import { analyzeSentiment } from '../sentiment'
import { APP_VERSIONS, PRODUCTS, store } from '../store'

const productFilter = ref('all')
const versionFilter = ref('all')

const productOptions = [{ value: 'all', label: 'Todos los productos' }, ...PRODUCTS.map((p) => ({ value: p, label: p }))]
const versionOptions = [{ value: 'all', label: 'Todas las versiones' }, ...APP_VERSIONS.map((v) => ({ value: v, label: v }))]

const filtered = computed(() =>
  store.responses.filter((item) => {
    const productOk = productFilter.value === 'all' || item.product === productFilter.value
    const versionOk = versionFilter.value === 'all' || item.appVersion === versionFilter.value
    return productOk && versionOk
  }),
)

const total = computed(() => filtered.value.length)

const average = computed(() => {
  if (!total.value) return 0
  const sum = filtered.value.reduce((acc, item) => acc + item.stars, 0)
  return Math.round((sum / total.value) * 10) / 10
})

const starDist = computed(() => {
  const counts = [5, 4, 3, 2, 1].map((n) => ({
    stars: n,
    count: filtered.value.filter((item) => item.stars === n).length,
  }))
  const max = Math.max(...counts.map((c) => c.count), 1)
  return counts.map((c) => ({ ...c, pct: Math.round((c.count / max) * 100) }))
})

const dayDist = computed(() => {
  const days = []
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const key = date.toISOString().slice(0, 10)
    days.push({
      key,
      label: date.toLocaleDateString('es-CO', { weekday: 'short' }),
      count: filtered.value.filter((item) => item.createdAt.slice(0, 10) === key).length,
    })
  }
  const max = Math.max(...days.map((d) => d.count), 1)
  return days.map((d) => ({ ...d, pct: Math.round((d.count / max) * 100) }))
})

const comments = computed(() =>
  filtered.value
    .filter((item) => item.comment)
    .map((item) => ({
      ...item,
      sentiment: item.sentiment || analyzeSentiment(item.comment),
    })),
)

const analyzed = computed(() => filtered.value.filter((item) => item.ai_status === 'done' && item.ai_tags))

const tagAverages = computed(() =>
  CSAT_TAG_KEYS.map((key) => {
    if (!analyzed.value.length) return { key, label: tagLabel(key), value: 0 }
    const sum = analyzed.value.reduce((acc, item) => acc + Number(item.ai_tags[key] || 0), 0)
    return { key, label: tagLabel(key), value: Math.round((sum / analyzed.value.length) * 100) }
  }),
)

const topProblems = computed(() => {
  const counts = new Map()
  for (const item of analyzed.value) {
    if (!item.ai_problem_text) continue
    counts.set(item.ai_problem_text, (counts.get(item.ai_problem_text) || 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([text, count]) => ({ text, count }))
})

function tagLabel(key) {
  if (key === 'security') return 'Seguridad'
  if (key === 'usability') return 'Usabilidad'
  if (key === 'product_likeability') return 'Producto'
  if (key === 'other') return 'Otro'
  return key
}

function tagBarClass(key) {
  if (key === 'security') return 'bg-error-dark'
  if (key === 'usability') return 'bg-primary-700'
  if (key === 'product_likeability') return 'bg-alert-dark'
  if (key === 'other') return 'bg-grey-700'
  return 'bg-grey-500'
}

function scorePct(tags, key) {
  return Math.round(Number(tags?.[key] || 0) * 100)
}

function tagVariant(stars) {
  if (stars >= 4) return 'success'
  if (stars === 3) return 'alert'
  return 'error'
}

function sentimentVariant(label) {
  if (label === 'positivo') return 'success'
  if (label === 'negativo') return 'error'
  return 'alert'
}

function sentimentText(label) {
  if (label === 'positivo') return 'Positivo'
  if (label === 'negativo') return 'Negativo'
  return 'Neutral'
}

function formatDate(iso) {
  return new Date(iso).toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <section class="space-y-dl24">
    <div class="rounded-dl24 bg-primary-1000 p-dl24 text-grey-0">
      <p class="dl-caption-sb text-primary-700">Vista métricas · Product Lead</p>
      <h1 class="mt-dl4 dl-h1-sb">Dashboard de resultados</h1>
      <p class="mt-dl8 dl-body-r text-grey-300">
        Respuestas del simulador y datos demo, persistidos en este navegador.
      </p>

      <div class="mt-dl24 grid gap-dl16 sm:grid-cols-2">
        <DlSelect v-model="productFilter" label="Producto" :options="productOptions" />
        <DlSelect v-model="versionFilter" label="Versión app" :options="versionOptions" />
      </div>
    </div>

    <div class="grid gap-dl16 sm:grid-cols-2">
      <article class="rounded-dl24 bg-grey-0 p-dl24">
        <p class="dl-body-r text-grey-600">Calificación promedio</p>
        <p class="mt-dl8 dl-h1-sb text-grey-1000">
          {{ average.toFixed(1) }}<span class="dl-title1-r text-grey-500"> / 5</span>
        </p>
        <div class="mt-dl8 flex gap-dl4">
          <DlIcon
            v-for="n in 5"
            :key="n"
            name="favorite"
            class="h-6 w-6"
            :class="n <= Math.round(average) ? 'text-alert-dark' : 'text-grey-300'"
          />
        </div>
      </article>

      <article class="rounded-dl24 bg-grey-0 p-dl24">
        <p class="dl-body-r text-grey-600">Total de respuestas</p>
        <p class="mt-dl8 dl-h1-sb text-grey-1000">{{ total }}</p>
        <p class="mt-dl8 dl-caption-r text-grey-500">Con los filtros actuales</p>
      </article>
    </div>

    <div class="grid gap-dl16 lg:grid-cols-2">
      <article class="rounded-dl24 bg-grey-0 p-dl24">
        <p class="dl-title2 text-grey-1000">Insights CSAT bajo (IA)</p>
        <p class="mt-dl8 dl-caption-r text-grey-500">
          Promedio de tags en {{ analyzed.length }} comentario{{ analyzed.length === 1 ? '' : 's' }} analizado{{ analyzed.length === 1 ? '' : 's' }}.
        </p>
        <div class="mt-dl16 space-y-dl12">
          <div v-for="row in tagAverages" :key="row.key">
            <div class="flex items-center justify-between">
              <span class="dl-caption-r text-grey-600">{{ row.label }}</span>
              <span class="dl-caption-sb text-grey-800">{{ row.value }}%</span>
            </div>
            <div class="mt-dl4 h-3 overflow-hidden rounded-full bg-grey-100">
              <div class="h-full rounded-full transition-all" :class="tagBarClass(row.key)" :style="{ width: `${row.value}%` }" />
            </div>
          </div>
        </div>
      </article>

      <article class="rounded-dl24 bg-grey-0 p-dl24">
        <p class="dl-title2 text-grey-1000">Problemas más citados</p>
        <ul v-if="topProblems.length" class="mt-dl16 space-y-dl12">
          <li v-for="row in topProblems" :key="row.text" class="flex items-start justify-between gap-dl12">
            <span class="dl-body-r text-grey-800">{{ row.text }}</span>
            <span class="dl-caption-sb text-grey-500">{{ row.count }}</span>
          </li>
        </ul>
        <p v-else class="mt-dl16 dl-body-r text-grey-500">Aún no hay problem_text extraído.</p>
      </article>
    </div>

    <div class="grid gap-dl16 lg:grid-cols-2">
      <article class="rounded-dl24 bg-grey-0 p-dl24">
        <p class="dl-title2 text-grey-1000">Distribución por estrellas</p>
        <div class="mt-dl16 space-y-dl12">
          <div v-for="row in starDist" :key="row.stars" class="flex items-center gap-dl12">
            <span class="w-8 dl-caption-r text-grey-600">{{ row.stars }} ★</span>
            <div class="h-3 flex-1 overflow-hidden rounded-full bg-grey-100">
              <div class="h-full rounded-full bg-primary-700 transition-all" :style="{ width: `${row.pct}%` }" />
            </div>
            <span class="w-6 text-right dl-caption-r text-grey-600">{{ row.count }}</span>
          </div>
        </div>
      </article>

      <article class="rounded-dl24 bg-grey-0 p-dl24">
        <p class="dl-title2 text-grey-1000">Respuestas últimos 7 días</p>
        <div class="mt-dl24 flex h-36 items-end gap-dl8">
          <div v-for="day in dayDist" :key="day.key" class="flex flex-1 flex-col items-center gap-dl8">
            <div class="flex h-28 w-full items-end">
              <div class="w-full rounded-t-dl8 bg-primary-1000" :style="{ height: `${Math.max(day.pct, 6)}%` }" />
            </div>
            <span class="dl-caption-r uppercase text-grey-500">{{ day.label }}</span>
          </div>
        </div>
      </article>
    </div>

    <article class="overflow-hidden rounded-dl24 bg-grey-0">
      <div class="border-b border-grey-200 px-dl24 py-dl16">
        <p class="dl-title2 text-grey-1000">Comentarios abiertos</p>
      </div>

      <div v-if="comments.length" class="overflow-x-auto">
        <table class="min-w-[1180px] w-full text-left">
          <thead class="bg-grey-100">
            <tr class="dl-caption-sb text-grey-600">
              <th class="px-dl16 py-dl12">Fecha</th>
              <th class="px-dl16 py-dl12">Producto</th>
              <th class="px-dl16 py-dl12">Estrellas</th>
              <th class="px-dl16 py-dl12">Píldoras</th>
              <th class="px-dl16 py-dl12">Comentario</th>
              <th class="px-dl16 py-dl12">Análisis de sentimiento</th>
              <th class="px-dl16 py-dl12">Análisis IA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-grey-200">
            <tr v-for="row in comments" :key="row.id" class="align-top dl-body-r text-grey-800">
              <td class="whitespace-nowrap px-dl16 py-dl16 dl-caption-r text-grey-600">
                {{ formatDate(row.createdAt) }}
              </td>
              <td class="px-dl16 py-dl16">
                <p class="dl-caption-sb text-grey-800">{{ row.product }}</p>
                <p class="mt-dl4 dl-caption-r text-grey-500">v{{ row.appVersion }}</p>
              </td>
              <td class="px-dl16 py-dl16">
                <DlTag :text="`${row.stars} ★`" :variant="tagVariant(row.stars)" />
              </td>
              <td class="px-dl16 py-dl16">
                <div v-if="row.pills.length" class="flex flex-wrap gap-dl8">
                  <DlChip v-for="pill in row.pills" :key="pill" :text="pill" active />
                </div>
                <span v-else class="dl-caption-r text-grey-400">—</span>
              </td>
              <td class="max-w-[320px] px-dl16 py-dl16 dl-body-r text-grey-800">{{ row.comment }}</td>
              <td class="px-dl16 py-dl16">
                <DlTag
                  :text="sentimentText(row.sentiment.label)"
                  :variant="sentimentVariant(row.sentiment.label)"
                />
              </td>
              <td class="min-w-[260px] px-dl16 py-dl16">
                <p v-if="row.ai_problem_text" class="dl-caption-sb text-grey-700">
                  {{ row.ai_problem_text }}
                </p>
                <p v-else-if="row.ai_status === 'error'" class="dl-caption-r text-error-dark">
                  No se pudo analizar: {{ row.ai_error }}
                </p>
                <p v-else class="dl-caption-r text-grey-400">Sin análisis IA</p>

                <div v-if="row.ai_tags" class="mt-dl8 space-y-dl4">
                  <div v-for="key in CSAT_TAG_KEYS" :key="key" class="flex items-center gap-dl8">
                    <span class="w-20 dl-caption-r text-grey-500">{{ tagLabel(key) }}</span>
                    <div class="h-1.5 flex-1 overflow-hidden rounded-full bg-grey-100">
                      <div
                        class="h-full rounded-full"
                        :class="tagBarClass(key)"
                        :style="{ width: `${scorePct(row.ai_tags, key)}%` }"
                      />
                    </div>
                    <span class="w-7 text-right dl-caption-r text-grey-500">
                      {{ scorePct(row.ai_tags, key) }}
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p v-else class="px-dl24 py-dl32 text-center dl-body-r text-grey-500">
        No hay comentarios con estos filtros.
      </p>
    </article>
  </section>
</template>
