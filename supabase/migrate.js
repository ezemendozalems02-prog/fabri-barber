// Corre schema.sql + seed.sql contra la base definida en DATABASE_URL
// (.env.local, nunca commiteado). Uso: node supabase/migrate.js
const { Client } = require('pg')
const fs = require('fs')
const path = require('path')

function loadEnvLocal() {
  const envPath = path.join(__dirname, '..', '.env.local')
  const raw = fs.readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of raw.split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.*)$/)
    if (m) env[m[1]] = m[2].trim()
  }
  return env
}

async function main() {
  const env = loadEnvLocal()
  if (!env.SUPABASE_DB_POOLER_URL) throw new Error('Falta SUPABASE_DB_POOLER_URL en .env.local')

  const client = new Client({ connectionString: env.SUPABASE_DB_POOLER_URL, ssl: { rejectUnauthorized: false } })
  await client.connect()
  console.log('Conectado a Supabase Postgres.')

  await client.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'))
  console.log('Schema aplicado.')

  await client.query(fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf8'))
  console.log('Seed aplicado.')

  const { rows } = await client.query(
    `select table_name from information_schema.tables where table_schema='public' order by table_name`,
  )
  console.log('Tablas:', rows.map((r) => r.table_name).join(', '))

  await client.end()
}

main().catch((e) => {
  console.error('MIGRATION_FAILED:', e.message)
  process.exit(1)
})
