import { Router } from 'express'

import { login, register, alterPassword } from '../controllers/login.controller.js'

const loginRouter = Router()

loginRouter.post('/', login)
loginRouter.post('/register', register)
loginRouter.put('/alter-password', alterPassword)

export { loginRouter }