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
    const error = new Error(result.message || 'Falha ao realizar login.')
    error.status = response.status
    throw error
  }

  return result
}

export async function changePasswordRequest(login, oldPassword, newPassword) {
  const response = await apiFetch('/login/alter-password', {
    method: 'PUT',
    redirectOn401: false,
    body: JSON.stringify({ login, oldPassword, newPassword })
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || 'Falha ao alterar senha.')
  }

  return result
}

export async function logoutRequest() {
  const response = await apiFetch('/login/logout', {
    method: 'POST',
    redirectOn401: false
  })

  if (!response.ok) {
    const result = await response.json().catch(() => ({}))
    throw new Error(result.message || 'Falha ao realizar logout.')
  }
}
