import 'dotenv/config'
import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb'

const FORMS_TABLE = process.env.DYNAMODB_FORMS_TABLE || 'mvp-hackaton'
const RESPONSES_TABLE = process.env.DYNAMODB_RESPONSES_TABLE || 'mvp-hackaton-responses'
const REGION = process.env.AWS_REGION || 'us-east-1'
const ENDPOINT = process.env.AWS_ENDPOINT || undefined

const client = new DynamoDBClient({
  region: REGION,
  ...(ENDPOINT ? { endpoint: ENDPOINT } : {}),
})

for (const name of [FORMS_TABLE, RESPONSES_TABLE]) {
  try {
    const res = await client.send(new DescribeTableCommand({ TableName: name }))
    const keys = (res.Table.KeySchema || []).map((k) => k.AttributeName).join(', ')
    console.log(`[db] ${name} ACTIVE (keys: ${keys})`)
  } catch (err) {
    console.error(`[db] ${name} not reachable: ${err.message}`)
    process.exit(1)
  }
}
