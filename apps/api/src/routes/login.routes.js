import { Router } from 'express'

import { login, register, alterPassword, logout } from '../controllers/login.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const loginRouter = Router()

loginRouter.post('/', login)
loginRouter.post('/register', register)
loginRouter.put('/alter-password', alterPassword)
loginRouter.post('/logout', authenticate, logout)

export { loginRouter }