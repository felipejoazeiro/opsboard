import { z } from 'zod'
import { getDbPool } from '../db/client.js'

const TaskListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().max(100).default(20),
  search: z.string().optional(),
  status: z.enum(['To Do', 'In Progress', 'Done']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
})

const CreateTaskSchema = z.object({
  title: z.string().trim().min(1, 'Titulo obrigatorio').max(140, 'Titulo muito longo'),
  description: z.string().trim().max(1000, 'Descricao muito longa').optional().or(z.literal('')),
  status: z.enum(['To Do', 'In Progress', 'Done']).default('To Do'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  dueDate: z.string().datetime().optional().or(z.literal('')),
})

export async function getTaskSummary(req, res, next) {
  try {
    const pool = getDbPool()

    const { rows } = await pool.query(
      `SELECT
         COUNT(*)::int AS total,
         COUNT(*) FILTER (WHERE t.status = 'Done')::int AS done,
         COUNT(*) FILTER (
           WHERE t.status = 'To Do'
             AND (t.due_date IS NULL OR t.due_date >= NOW())
         )::int AS todo,
         COUNT(*) FILTER (
           WHERE t.status = 'In Progress'
             AND (t.due_date IS NULL OR t.due_date >= NOW())
         )::int AS in_progress,
         COUNT(*) FILTER (
           WHERE t.status <> 'Done'
             AND t.due_date IS NOT NULL
             AND t.due_date < NOW()
         )::int AS late
       FROM tasks t`
    )

    const summary = rows[0]
    const distribution = {
      todo: summary.todo,
      inProgress: summary.in_progress,
      late: summary.late,
    }

    return res.json({
      data: {
        total: summary.total,
        done: summary.done,
        active: distribution.todo + distribution.inProgress + distribution.late,
        distribution,
      },
    })
  } catch (error) {
    next(error)
  }
}

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

export async function createTask(req, res, next) {
  try {
    const parsed = CreateTaskSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Dados invalidos para criar tarefa.',
        errors: parsed.error.flatten(),
      })
    }

    const { title, description, status, priority, dueDate } = parsed.data
    const pool = getDbPool()

    const createdBy = req.user?.sub || req.user?.name || req.user?.email || 'system'

    const { rows } = await pool.query(
      `INSERT INTO tasks (id, title, description, status, priority, due_date, created_by)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6)
       RETURNING id, title, description, status, priority, due_date, created_at, created_by, updated_at`,
      [
        title,
        description || null,
        status,
        priority,
        dueDate ? new Date(dueDate).toISOString() : null,
        String(createdBy),
      ]
    )

    return res.status(201).json(rows[0])
  } catch (error) {
    next(error)
  }
}

export async function updateTask(req, res, next) {
  try {
    const parsed = CreateTaskSchema.partial().safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Dados invalidos para atualizar tarefa.',
        errors: parsed.error.flatten(),
      })
    }

    const { title, description, status, priority, dueDate } = parsed.data
    const { id } = req.params
    const pool = getDbPool()

    const { rows } = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           status = COALESCE($3, status),
           priority = COALESCE($4, priority),
           due_date = COALESCE($5, due_date),
           updated_at = NOW()
       WHERE id = $6
       RETURNING id, title, description, status, priority, due_date, created_at, created_by, updated_at`,
      [
        title,
        description || null,
        status,
        priority,
        dueDate ? new Date(dueDate).toISOString() : null,
        id,
      ]
    )
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' })
    }
    return res.status(200).json(rows[0])
  } catch (error) {
      next(error)
  }
}

export async function deleteTask(req, res, next) {
  try {
    const { id } = req.params
    const pool = getDbPool()
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id])

    if (rowCount === 0) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' })
    }
    return res.status(204).send()
  }
  catch (error) {
    next(error)
  }
}