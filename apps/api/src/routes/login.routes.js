import { Router } from 'express'

import { login, register } from '../controllers/login.controller.js'

const loginRouter = Router()

loginRouter.post('/', login)
loginRouter.post('/register', register)

export { loginRouter }