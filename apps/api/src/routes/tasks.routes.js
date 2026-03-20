import { Router } from 'express'
import { listTasks } from '../controllers/tasks.controller.js'

const tasksRouter = Router()

tasksRouter.get('/', listTasks)

export { tasksRouter }
