import { Router } from 'express'
import { testDbConnection } from '../db/client.js'
import { employeesRouter } from './employees.routes.js'

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

router.use('/employees', employeesRouter)

export { router }
