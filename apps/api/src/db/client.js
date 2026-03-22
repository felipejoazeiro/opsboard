import { Pool } from 'pg'
import { env } from '../config/env.js'

let pool = null

export function hasDatabaseConfig() {
  return Boolean(env.databaseUrl)
}

export function getDbPool() {
  if (!hasDatabaseConfig()) {
    throw new Error('DATABASE_URL nao configurada. Defina-a no arquivo .env.')
  }

  if (!pool) {
    pool = new Pool({
      connectionString: env.databaseUrl
    })
  }

  return pool
}

export async function testDbConnection() {
  if (!hasDatabaseConfig()) {
    return { connected: false, reason: 'DATABASE_URL nao configurada' }
  }

  const client = await getDbPool().connect()
  try {
    await client.query('SELECT 1')
    return { connected: true }
  } finally {
    client.release()
  }
}

export async function runMigrations() {
  if (!hasDatabaseConfig()) return

  await getDbPool().query(`
    CREATE TABLE IF NOT EXISTS revoked_tokens (
      jti       TEXT        PRIMARY KEY,
      expires_at TIMESTAMPTZ NOT NULL
    )
  `)
}
