import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { geminiConfigFromEnv } from './src/ai/csatCore.js'
import { runCsatAgent } from './src/ai/runCsatAgent.js'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8')
      if (!raw) {
        resolve({})
        return
      }
      try {
        resolve(JSON.parse(raw))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

function analyzeCsatPlugin(env) {
  const handle = async (req, res, next) => {
    const path = req.url?.split('?')[0]
    if (path !== '/api/analyze-csat') {
      next()
      return
    }

    const { apiKey, model, configured } = geminiConfigFromEnv(env)

    if (req.method === 'GET') {
      sendJson(res, 200, { configured })
      return
    }

    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method not allowed' })
      return
    }

    try {
      const body = await readJsonBody(req)
      const insight = await runCsatAgent(body.comment, { apiKey, model })
      sendJson(res, 200, insight)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo analizar el comentario.'
      sendJson(res, 500, { error: message })
    }
  }

  return {
    name: 'analyze-csat-api',
    configureServer(server) {
      server.middlewares.use(handle)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handle)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [vue(), analyzeCsatPlugin(env)],
    server: {
      port: 5173,
      host: true,
      watch: { usePolling: true, interval: 300 },
    },
  }
})
