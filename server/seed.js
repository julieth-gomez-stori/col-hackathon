import 'dotenv/config'
import { seedForms, seedResponses } from '../src/seed.js'
import { initStore } from './db.js'

const db = await initStore()

if (db.kind !== 'dynamodb') {
  console.error('[seed] DynamoDB is not available; aborting so we do not write only to memory')
  process.exit(1)
}

for (const form of seedForms()) {
  await db.putForm(form)
  console.log(`[seed] form ${form.id}`)
}

for (const response of seedResponses()) {
  await db.putResponse(response)
  console.log(`[seed] response ${response.id}`)
}

const forms = await db.listForms()
const responses = await db.listResponses()
console.log(`[seed] done — ${forms.length} forms, ${responses.length} responses`)
