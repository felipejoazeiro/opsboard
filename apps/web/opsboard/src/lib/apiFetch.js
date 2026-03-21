import { clearSession, hasValidAccessToken } from './auth.js'

const API_BASE = import.meta.env.VITE_API_URL

/**
 * Wrapper sobre fetch que injeta automaticamente o Authorization: Bearer header
 * quando houver um token salvo no localStorage.
 *
 * Uso:
 *   const data = await apiFetch('/employees')
 *   const data = await apiFetch('/employees', { method: 'POST', body: JSON.stringify({...}) })
 */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('access_token')
  const shouldRedirectOnUnauthorized = options.redirectOn401 ?? true

  if (token && !hasValidAccessToken()) {
    clearSession()
    if (shouldRedirectOnUnauthorized) {
      window.location.href = '/'
    }

    return new Response(
      JSON.stringify({ message: 'Sessao expirada. Faca login novamente.' }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (response.status === 401 && shouldRedirectOnUnauthorized) {
    clearSession()
    window.location.href = '/'
  }

  return response
}
