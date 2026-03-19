import { EmployeeSchema } from '../../../../packages/schemas/EmployeeSchema.js'
import { getDbPool } from '../db/client.js'

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
  try {
    const parsed = EmployeeSchema.omit({ id: true, createdAt: true }).safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Dados invalidos para criar funcionario.',
        errors: parsed.error.flatten()
      })
    }

    const { name, email, role, isActive, teamId } = parsed.data

    const { rows } = await getDbPool().query(
      `INSERT INTO employees (name, email, role, is_active, team_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, role, is_active AS "isActive", created_at AS "createdAt", team_id AS "teamId"`,
      [name, email, role, isActive, teamId]
    )

    return res.status(201).json(rows[0])
  } catch (error) {
    return next(error)
  }
}
