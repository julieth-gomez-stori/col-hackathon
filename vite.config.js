import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    // fsevents no reporta de forma fiable las escrituras en este entorno.
    watch: { usePolling: true, interval: 300 },
  },
})
