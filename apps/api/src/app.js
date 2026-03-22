import cors from 'cors'
import express from 'express'
import swaggerUi from 'swagger-ui-express'
import { router } from './routes/index.js'
import { swaggerSpec } from './docs/swagger.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use('/api', router)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({
    message: 'Erro interno no servidor.',
    details: err.message
  })
})

export { app }
