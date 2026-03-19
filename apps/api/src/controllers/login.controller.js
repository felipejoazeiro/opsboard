import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { getDbPool } from '../db/client.js'

const LoginSchema = z.object({
  login: z.string().email('Informe um e-mail valido.'),
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
      'SELECT id, name, email, role, password_hash AS "passwordHash" FROM employees WHERE email = $1',
      [login]
    )

    if (rows.length === 0) {
      return res.status(401).json({
        message: 'Credenciais inválidas.'
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
    return res.status(200).json(user)
  }catch (error) {
    return res.status(500).json({
      message: 'Erro interno no servidor.',
      details: error.message
    })
  }
}
