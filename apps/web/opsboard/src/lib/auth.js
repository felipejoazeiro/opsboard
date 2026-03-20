function decodeBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return atob(padded)
}

export function parseJwt(token) {
  if (!token || typeof token !== 'string') {
    return null
  }

  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    return JSON.parse(decodeBase64Url(parts[1]))
  } catch {
    return null
  }
}

export function isTokenExpired(token) {
  const payload = parseJwt(token)
  if (!payload || typeof payload.exp !== 'number') {
    return true
  }

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return payload.exp <= nowInSeconds
}

export function hasValidAccessToken() {
  const token = localStorage.getItem('access_token')
  if (!token || isTokenExpired(token)) {
    return false
  }

  return true
}

export function clearSession() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
}
