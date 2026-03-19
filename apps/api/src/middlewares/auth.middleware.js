import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

/**
 * Middleware que valida o JWT enviado no header Authorization: Bearer <token>
 * e expõe req.user = { sub, name, email, role } para os controllers.
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de acesso nao fornecido.' })
  }

  const token = authHeader.slice(7)

  try {
    const payload = jwt.verify(token, env.jwtSecret)
    req.user = payload
    return next()
  } catch {
    return res.status(401).json({ message: 'Token invalido ou expirado.' })
  }
}

/**
 * Middleware de autorização por role.
 * Uso: authorize('Manager', 'Staff')
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Nao autenticado.' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Acesso negado. Requer perfil: ${allowedRoles.join(' ou ')}.`
      })
    }

    return next()
  }
}
