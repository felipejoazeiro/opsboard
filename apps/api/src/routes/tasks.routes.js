import { Router } from 'express'
import { createTask, listTasks } from '../controllers/tasks.controller.js'

const tasksRouter = Router()

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Lista tarefas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tarefas
 */
tasksRouter.get('/', listTasks)

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Cria uma nova tarefa
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TaskInput'
 *     responses:
 *       201:
 *         description: Tarefa criada com sucesso
 *       400:
 *         description: Dados invalidos
 */
tasksRouter.post('/', createTask)

export { tasksRouter }
