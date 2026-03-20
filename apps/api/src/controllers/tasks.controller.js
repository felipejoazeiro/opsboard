import { z } from 'zod'
import { getDbPool } from '../db/client.js'

const TaskListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Done']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
})

export async function listTasks(req, res, next) {
  try {
    const parsed = TaskListQuerySchema.safeParse(req.query)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Parametros invalidos.',
        errors: parsed.error.flatten(),
      })
    }

    const { page, pageSize, search, status, priority } = parsed.data
    const offset = (page - 1) * pageSize
    const pool = getDbPool()

    const conditions = []
    const params = []

    if (search) {
      params.push(`%${search}%`)
      conditions.push(`t.title ILIKE $${params.length}`)
    }

    if (status) {
      params.push(status)
      conditions.push(`t.status = $${params.length}`)
    }

    if (priority) {
      params.push(priority)
      conditions.push(`t.priority = $${params.length}`)
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    const countParams = [...params]
    const dataParams = [...params, pageSize, offset]

    const [{ rows: countRows }, { rows }] = await Promise.all([
      pool.query(`SELECT COUNT(*) AS total FROM tasks t ${where}`, countParams),
      pool.query(
        `SELECT
           t.id,
           t.title,
           t.description,
           t.status,
           t.priority,
           t.due_date,
           t.created_at,
           t.created_by,
           t.updated_at
         FROM tasks t
         ${where}
         ORDER BY t.created_at DESC
         LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        dataParams
      ),
    ])

    const total = Number(countRows[0].total)
    const totalPages = Math.ceil(total / pageSize)

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
    next(error)
  }
}
