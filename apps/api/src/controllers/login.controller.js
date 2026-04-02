import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
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
      `SELECT e.id, e.name, e.email, r.level AS role, r.name AS "roleName", l.password_hash AS "passwordHash"
       FROM logins l
       JOIN employees e ON e.login_id = l.id
       JOIN roles r ON e.role_id = r.id
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

    if (password === env.primaryPassword) {
      return res.status(403).json({
        message: 'Voce esta usando a senha padrao. Por favor, altere sua senha para continuar.'
      })
    }

    delete user.passwordHash

    const jti = randomUUID()
    const token = jwt.sign(
      { jti, sub: user.id, name: user.name, email: user.email, role: user.role },
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

export async function alterPassword(req, res) {
  try {
    const parsed = z.object({
      login: z.string().min(1, 'Informe o login.'),
      oldPassword: z.string().min(1, 'Informe a senha atual.'),
      newPassword: z.string().min(8, 'A nova senha deve ter pelo menos 8 caracteres.')
    }).safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        message: 'Dados invalidos para alterar senha.',
        errors: parsed.error.flatten()
      })
    }
    
    const { login, oldPassword, newPassword } = parsed.data

    const { rows } = await getDbPool().query(
      `SELECT id, password_hash AS "passwordHash"
       FROM logins
       WHERE login = $1`,
      [login]
    )

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Usuario nao encontrado.'
      })
    }

    const user = rows[0]
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash)

    if (!isOldPasswordValid) {
      return res.status(401).json({
        message: 'Senha atual invalida.'
      })
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12)

    await getDbPool().query(
      `UPDATE logins
       SET password_hash = $1
       WHERE id = $2`,
      [newPasswordHash, user.id]
    )

    return res.status(200).json({
      message: 'Senha alterada com sucesso.'
    })
  } catch (error) {
    return res.status(500).json({
      message: 'Erro interno no servidor.',
      details: error.message
    })
  }
}

export async function logout(req, res) {
  try {
    const { jti, exp } = req.user

    if (!jti || !exp) {
      return res.status(400).json({ message: 'Token nao possui identificador para revogacao.' })
    }

    const expiresAt = new Date(exp * 1000)

    await getDbPool().query(
      `INSERT INTO revoked_tokens (jti, expires_at) VALUES ($1, $2) ON CONFLICT (jti) DO NOTHING`,
      [jti, expiresAt]
    )

    // Remove tokens já expirados para manter a tabela enxuta
    await getDbPool().query(`DELETE FROM revoked_tokens WHERE expires_at <= NOW()`)

    return res.status(200).json({ message: 'Logout realizado com sucesso.' })
  } catch (error) {
    return res.status(500).json({
      message: 'Erro interno no servidor.',
      details: error.message
    })
  }
}
