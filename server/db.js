import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb'

const FORMS_TABLE = process.env.DYNAMODB_FORMS_TABLE || 'mvp-hackaton'
const RESPONSES_TABLE = process.env.DYNAMODB_RESPONSES_TABLE || 'mvp-hackaton-responses'
const REGION = process.env.AWS_REGION || 'us-east-1'
const ENDPOINT = process.env.AWS_ENDPOINT || undefined

function compact(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined && value !== null && value !== ''),
  )
}

function toForm(item) {
  if (!item) return null
  const { survey_id, ...rest } = item
  return { ...rest, id: rest.id || survey_id }
}

function toResponse(item) {
  if (!item) return null
  const { response_id, ...rest } = item
  return { ...rest, id: rest.id || response_id }
}

async function scanAll(doc, tableName) {
  const items = []
  let ExclusiveStartKey
  do {
    const page = await doc.send(
      new ScanCommand({
        TableName: tableName,
        ExclusiveStartKey,
      }),
    )
    items.push(...(page.Items || []))
    ExclusiveStartKey = page.LastEvaluatedKey
  } while (ExclusiveStartKey)
  return items
}

function createMemoryStore() {
  const forms = new Map()
  const responses = []

  return {
    kind: 'memory',
    tables: { forms: FORMS_TABLE, responses: RESPONSES_TABLE },
    async listForms() {
      return [...forms.values()]
    },
    async putForm(form) {
      forms.set(form.id, { ...form })
      return forms.get(form.id)
    },
    async getForm(id) {
      return forms.get(id) ?? null
    },
    async listResponses() {
      return [...responses].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
    },
    async putResponse(response) {
      const idx = responses.findIndex((item) => item.id === response.id)
      if (idx >= 0) responses[idx] = { ...response }
      else responses.unshift({ ...response })
      return response
    },
  }
}

function createDynamoStore(doc) {
  return {
    kind: 'dynamodb',
    tables: { forms: FORMS_TABLE, responses: RESPONSES_TABLE },
    async listForms() {
      return (await scanAll(doc, FORMS_TABLE)).map(toForm)
    },
    async putForm(form) {
      const item = compact({
        ...form,
        survey_id: form.id,
        id: form.id,
      })
      await doc.send(new PutCommand({ TableName: FORMS_TABLE, Item: item }))
      return toForm(item)
    },
    async getForm(id) {
      const res = await doc.send(
        new GetCommand({
          TableName: FORMS_TABLE,
          Key: { survey_id: id },
        }),
      )
      return toForm(res.Item)
    },
    async listResponses() {
      return (await scanAll(doc, RESPONSES_TABLE))
        .map(toResponse)
        .sort((a, b) => String(b.createdAt || '').localeCompare(String(a.createdAt || '')))
    },
    async putResponse(response) {
      const item = compact({
        ...response,
        response_id: response.id,
        id: response.id,
      })
      await doc.send(new PutCommand({ TableName: RESPONSES_TABLE, Item: item }))
      return toResponse(item)
    },
  }
}

export async function initStore() {
  const client = new DynamoDBClient({
    region: REGION,
    ...(ENDPOINT ? { endpoint: ENDPOINT } : {}),
  })
  const doc = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  })

  try {
    await Promise.all([
      client.send(new DescribeTableCommand({ TableName: FORMS_TABLE })),
      client.send(new DescribeTableCommand({ TableName: RESPONSES_TABLE })),
    ])
    console.log(`[db] DynamoDB ${FORMS_TABLE} + ${RESPONSES_TABLE} (${REGION})`)
    return createDynamoStore(doc)
  } catch (err) {
    console.warn(
      `[db] DynamoDB unavailable (${err.name || 'Error'}: ${err.message}) — falling back to in-memory store`,
    )
    return createMemoryStore()
  }
}
