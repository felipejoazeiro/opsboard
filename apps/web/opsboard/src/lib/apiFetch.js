const API_BASE = 'http://localhost:3333/api'

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

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (response.status === 401) {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
    window.location.href = '/'
    return
  }

  return response
}
