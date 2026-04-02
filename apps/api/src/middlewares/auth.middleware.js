import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { getDbPool } from '../db/client.js'

/**
 * Middleware que valida o JWT enviado no header Authorization: Bearer <token>
 * e expõe req.user = { sub, name, email, role } para os controllers.
 * Verifica também se o token foi revogado (blocklist na tabela revoked_tokens).
 */
export async function authenticate(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de acesso nao fornecido.' })
  }

  const token = authHeader.slice(7)

  let payload
  try {
    payload = jwt.verify(token, env.jwtSecret)
  } catch {
    return res.status(401).json({ message: 'Token invalido ou expirado.' })
  }

  if (payload.jti) {
    try {
      const { rows } = await getDbPool().query(
        'SELECT 1 FROM revoked_tokens WHERE jti = $1',
        [payload.jti]
      )
      if (rows.length > 0) {
        return res.status(401).json({ message: 'Token revogado. Faca login novamente.' })
      }
    } catch {
      return res.status(500).json({ message: 'Erro ao verificar token.' })
    }
  }

  req.user = payload
  return next()
}

/**
 * Middleware de autorização por role.
 * Uso: authorize('Manager', 'Staff')
 */
export function authorize(...allowedRoles) {
  const normalizedRoles = allowedRoles
    .flat()
    .filter(Boolean)
    .map((role) => String(role).toLowerCase())

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Nao autenticado.' })
    }

    const userRole = String(req.user.role || '').toLowerCase()

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `Acesso negado. Requer perfil: ${normalizedRoles.join(',')}.`
      })
    }

    return next()
  }
}
