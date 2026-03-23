import { z } from 'zod'
import { getDbPool } from '../db/client.js'

const TeamListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(10)
})

const CreateTeamSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().trim().max(500, 'Description is too long').optional().or(z.literal('')),
})

export async function listTeams(req, res, next) {
  try {
    const parsed = TeamListQuerySchema.safeParse(req.query)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Invalid pagination parameters.',
        errors: parsed.error.flatten(),
      })
    }

    const { page, pageSize } = parsed.data
    const offset = (page - 1) * pageSize
    const pool = getDbPool()

    const [{ rows: countRows }, { rows }] = await Promise.all([
      pool.query('SELECT COUNT(*) AS total FROM teams'),
      pool.query('SELECT * FROM teams ORDER BY created_at DESC LIMIT $1 OFFSET $2', [pageSize, offset]),
    ])

    const total = countRows[0]?.total ?? 0
    const totalPages = total === 0 ? 0 : Math.ceil(total / pageSize)

    return res.json({
      data: rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    })
  } catch (error) {
    return next(error)
  }
}

export async function createTeam(req, res, next) {
    try {
        const parsed = CreateTeamSchema.safeParse(req.body)

        if (!parsed.success) {
            return res.status(400).json({
                message: 'Invalid data to create team.',
                errors: parsed.error.flatten(),
            })
        }

        const { name, description } = parsed.data
        const pool = getDbPool()

        const { rows } = await pool.query(
            'INSERT INTO teams (name, description, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [name, description]
        )

        return res.status(201).json({ data: rows[0] })
    } catch (error) {
        return next(error)
    }
}
