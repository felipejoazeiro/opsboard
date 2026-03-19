import cors from 'cors'
import express from 'express'
import { router } from './routes/index.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api', router)

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({
    message: 'Erro interno no servidor.',
    details: err.message
  })
})

export { app }
