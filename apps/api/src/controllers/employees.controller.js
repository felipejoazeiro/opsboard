import { EmployeeSchema } from '../../../../packages/schemas/EmployeeSchema.js'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { getDbPool } from '../db/client.js'
import { env } from '../config/env.js'

const CreateEmployeeSchema = EmployeeSchema.omit({ id: true, createdAt: true })

function normalizeLoginBase(name) {
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')

  return normalized || 'user'
}

async function  createUniqueLogin(client, baseLogin, passwordHash) {
  for (let i = 0; i < 100; i += 1) {
    const suffix = i === 0 ? '' : String(i + 1)
    const candidate = `${baseLogin}${suffix}`

    const { rows } = await client.query(
      `INSERT INTO logins (login, password_hash)
       VALUES ($1, $2)
       ON CONFLICT (login) DO NOTHING
       RETURNING id, login`,
      [candidate, passwordHash]
    )

    if (rows.length > 0) {
      return rows[0]
    }
  }

  throw new Error('Nao foi possivel gerar um login unico para o funcionario.')
}

export async function listEmployees(_req, res, next) {
  try {
    const { rows } = await getDbPool().query(
      'SELECT id, name, email, role, is_active AS "isActive", created_at AS "createdAt", team_id AS "teamId" FROM employees ORDER BY created_at DESC'
    )

    return res.json(rows)
  } catch (error) {
    return next(error)
  }
}

export async function createEmployee(req, res, next) {
  if (!env.primaryPassword) {
    return res.status(500).json({
      message: 'PRIMARY_PASSWORD nao configurada. Defina no .env antes de criar funcionarios.'
    })
  }

  try {
    const parsed = CreateEmployeeSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Dados invalidos para criar funcionario.',
        errors: parsed.error.flatten()
      })
    }

    const { name, email, role, isActive, teamId } = parsed.data
    const passwordHash = await bcrypt.hash(env.primaryPassword, 12)
    const baseLogin = normalizeLoginBase(name)

    const client = await getDbPool().connect()
    try {
      await client.query('BEGIN')

      const login = await createUniqueLogin(client, baseLogin, passwordHash)

      const { rows } = await client.query(
        `INSERT INTO employees (name, email, role, is_active, team_id, login_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, name, email, role, is_active AS "isActive", created_at AS "createdAt", team_id AS "teamId", login_id AS "loginId"`,
        [name, email, role, isActive, teamId, login.id]
      )

      await client.query('COMMIT')

      return res.status(201).json({
        ...rows[0],
        login: login.login,
        primaryPasswordConfigured: true
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    return next(error)
  }
}
