import { Router } from 'express'
import { createTask, listTasks } from '../controllers/tasks.controller.js'

const tasksRouter = Router()

tasksRouter.get('/', listTasks)
tasksRouter.post('/', createTask)

export { tasksRouter }
