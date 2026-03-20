import { apiFetch } from '../lib/apiFetch.js'

/**
 * Camada de acesso à API de autenticação.
 * Responsável apenas por saber como comunicar com o endpoint de login.
 */
export async function loginRequest(login, password) {
  const response = await apiFetch('/login', {
    method: 'POST',
    redirectOn401: false,
    body: JSON.stringify({ login, password })
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Falha ao realizar login.')
  }

  return result
}
