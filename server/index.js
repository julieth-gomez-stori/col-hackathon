import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { initStore } from './db.js'

const PORT = Number(process.env.PORT || 8787)
const app = express()

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  }),
)
app.use(express.json({ limit: '1mb' }))

const db = await initStore()

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    store: db.kind,
    tables: db.tables,
  })
})

app.get('/v1/forms', async (_req, res) => {
  try {
    res.json({ forms: await db.listForms() })
  } catch (err) {
    console.error('[api] GET /v1/forms', err)
    res.status(500).json({ error: 'failed_to_list_forms' })
  }
})

app.post('/v1/forms', async (req, res) => {
  try {
    const body = req.body || {}
    const id = body.id || `form-${Date.now()}`
    const form = await db.putForm({ ...body, id })
    res.status(201).json(form)
  } catch (err) {
    console.error('[api] POST /v1/forms', err)
    res.status(500).json({ error: 'failed_to_save_form' })
  }
})

app.put('/v1/forms/:id', async (req, res) => {
  try {
    const form = await db.putForm({ ...(req.body || {}), id: req.params.id })
    res.json(form)
  } catch (err) {
    console.error('[api] PUT /v1/forms/:id', err)
    res.status(500).json({ error: 'failed_to_update_form' })
  }
})

app.get('/v1/responses', async (_req, res) => {
  try {
    res.json({ responses: await db.listResponses() })
  } catch (err) {
    console.error('[api] GET /v1/responses', err)
    res.status(500).json({ error: 'failed_to_list_responses' })
  }
})

app.post('/v1/responses', async (req, res) => {
  try {
    const body = req.body || {}
    if (!body.formId) {
      res.status(400).json({ error: 'formId_required' })
      return
    }
    const response = await db.putResponse({
      ...body,
      id: body.id || `r-${Date.now()}`,
      createdAt: body.createdAt || new Date().toISOString(),
    })
    res.status(201).json(response)
  } catch (err) {
    console.error('[api] POST /v1/responses', err)
    res.status(500).json({ error: 'failed_to_save_response' })
  }
})

app.listen(PORT, () => {
  console.log(`[api] listening on http://localhost:${PORT} (store=${db.kind})`)
})
