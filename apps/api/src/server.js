import { app } from './app.js'
import { env } from './config/env.js'
import { runMigrations } from './db/client.js'

runMigrations()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`[api] rodando em http://localhost:${env.port}`)
    })
  })
  .catch((err) => {
    console.error('[api] Falha ao executar migrations:', err)
    process.exit(1)
  })
