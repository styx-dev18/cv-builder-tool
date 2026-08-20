import { apiRequest } from '@/services/api'
import type { User } from '@/types/user'

export type OAuthProvider = 'google_oauth2' | 'github'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function startOAuthLogin(provider: OAuthProvider) {
  window.location.href = `${API_BASE_URL}/auth/${provider}`
}

interface SessionResponse {
  access_token: string
  access_token_expires_at: string
  user: User
}

export function refreshSession() {
  return apiRequest<SessionResponse>('/auth/refresh', { method: 'POST' })
}

export function fetchCurrentUser(accessToken: string) {
  return apiRequest<{ user: User }>('/auth/me', { accessToken })
}

export function logout(accessToken: string | null) {
  return apiRequest<void>('/auth/logout', {
    method: 'DELETE',
    accessToken: accessToken ?? undefined,
  })
}
