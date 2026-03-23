import { Router } from 'express'
import { testDbConnection } from '../db/client.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { employeesRouter } from './employees.routes.js'
import { loginRouter } from './login.routes.js'
import { tasksRouter } from './tasks.routes.js'
import { teamsRouter } from './teams.routes.js'

const router = Router()

router.get('/health', async (_req, res) => {
  try {
    const db = await testDbConnection()
    return res.json({ status: 'ok', db })
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Falha ao verificar conexao com banco.',
      details: error.message
    })
  }
})

router.use('/login', loginRouter)
router.use('/employees', authenticate, employeesRouter)
router.use('/tasks', authenticate, tasksRouter)
router.use('/teams', authenticate, teamsRouter)

export { router }
