const AUTH_TOKEN_KEY = "cinematix_access_token"

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null
  }

  return (
    window.sessionStorage.getItem(AUTH_TOKEN_KEY) ??
    window.localStorage.getItem(AUTH_TOKEN_KEY)
  )
}

export function setAuthToken(token: string, remember = false): void {
  const normalizedToken = token.trim()

  if (!normalizedToken) {
    throw new TypeError("An access token is required.")
  }

  if (typeof window === "undefined") {
    throw new Error("Authentication tokens can only be saved in the browser.")
  }

  clearAuthToken()
  const storage = remember ? window.localStorage : window.sessionStorage
  storage.setItem(AUTH_TOKEN_KEY, normalizedToken)
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") {
    return
  }

  window.sessionStorage.removeItem(AUTH_TOKEN_KEY)
  window.localStorage.removeItem(AUTH_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return getAuthToken() !== null
}
