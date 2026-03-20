import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { env } from '../config/env.js'
import { getDbPool } from '../db/client.js'

const LoginSchema = z.object({
  login: z.string().min(1, 'Informe o login.'),
  password: z.string().min(1, 'Senha obrigatoria.')
})

export async function login(req, res) {
  try{
    const parsed = LoginSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Dados invalidos para login.',
        errors: parsed.error.flatten()
      })
    }

    const { login, password } = parsed.data

    const {rows} = await getDbPool().query(
      `SELECT e.id, e.name, e.email, e.role, l.password_hash AS "passwordHash"
       FROM logins l
       JOIN employees e ON e.login_id = l.id
       WHERE l.login = $1`,
      [login]
    )

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Usuario nao encontrado.'
      })
    }

    const user = rows[0]
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Credenciais inválidas.'
      })
    }

    delete user.passwordHash

    const token = jwt.sign(
      { sub: user.id, name: user.name, email: user.email, role: user.role },
      env.jwtSecret,
      { expiresIn: env.jwtExpiresIn }
    )

    return res.status(200).json({ token, user })
  }catch (error) {
    return res.status(500).json({
      message: 'Erro interno no servidor.',
      details: error.message
    })
  }
}

export async function register(req, res) {
  try{
    const parsed = LoginSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Dados invalidos para registro.',
        errors: parsed.error.flatten()
      })
    }

    const { login, password } = parsed.data
    const passwordHash = await bcrypt.hash(password, 12)

    const { rows } = await getDbPool().query(
      `INSERT INTO logins (login, password_hash)
       VALUES ($1, $2)
       RETURNING id, login`,
      [login, passwordHash]
    )

    return res.status(201).json(rows[0])

  }catch (error) {
    return res.status(500).json({
      message: 'Erro interno no servidor.',
      details: error.message
    })
  }

}
