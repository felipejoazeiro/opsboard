import { Router } from 'express'

import { login, register, alterPassword, logout } from '../controllers/login.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'

const loginRouter = Router()

/**
 * @openapi
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Realiza login e retorna token JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginSuccessResponse'
 *       401:
 *         description: Credenciais invalidas
 *       403:
 *         description: Usuario usando senha padrao (primeiro acesso)
 */
loginRouter.post('/', login)

/**
 * @openapi
 * /login/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registra um novo login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       201:
 *         description: Login criado com sucesso
 *       400:
 *         description: Dados invalidos
 */
loginRouter.post('/register', register)

/**
 * @openapi
 * /login/alter-password:
 *   put:
 *     tags: [Auth]
 *     summary: Altera senha do usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       401:
 *         description: Usuario/senha atual invalidos
 */
loginRouter.put('/alter-password', alterPassword)

/**
 * @openapi
 * /login/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Revoga o token atual (logout)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 *       401:
 *         description: Token invalido, expirado ou ausente
 */
loginRouter.post('/logout', authenticate, logout)

export { loginRouter }