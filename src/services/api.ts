import { useAuthStore } from '@/store/authStore'
import type { User } from '@/types/user'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface ApiErrorBody {
  code: string
  message: string
  details?: unknown
}

export class ApiError extends Error {
  status: number
  code: string
  details?: unknown

  constructor(status: number, body: ApiErrorBody) {
    super(body.message)
    this.status = status
    this.code = body.code
    this.details = body.details
  }
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: unknown
  accessToken?: string
}

interface RefreshedSession {
  access_token: string
  access_token_expires_at: string
  user: User
}

let refreshPromise: Promise<string | null> | null = null

function isAuthEndpoint(path: string): boolean {
  return path.startsWith('/auth/')
}

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
      .then(async (res) => {
        if (!res.ok) return null
        const json = await res.json().catch(() => null)
        const session = json?.data as RefreshedSession | undefined
        if (!session) return null

        useAuthStore.getState().setSession({
          accessToken: session.access_token,
          accessTokenExpiresAt: session.access_token_expires_at,
          user: session.user,
        })
        return session.access_token
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null
      })
  }
  return refreshPromise
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  })

  if (res.status === 401 && options.accessToken && !isAuthEndpoint(path)) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      return apiRequest<T>(path, { ...options, accessToken: newToken })
    }
    useAuthStore.getState().clear()
  }

  const json = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(
      res.status,
      json?.error ?? { code: 'unknown_error', message: 'Request failed' },
    )
  }

  return json?.data as T
}

export async function apiRequestBlob(
  path: string,
  options: { accessToken?: string } = {},
): Promise<Blob> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      ...(options.accessToken ? { Authorization: `Bearer ${options.accessToken}` } : {}),
    },
  })

  if (res.status === 401 && options.accessToken && !isAuthEndpoint(path)) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      return apiRequestBlob(path, { ...options, accessToken: newToken })
    }
    useAuthStore.getState().clear()
  }

  if (!res.ok) {
    const json = await res.json().catch(() => null)
    throw new ApiError(
      res.status,
      json?.error ?? { code: 'unknown_error', message: 'Request failed' },
    )
  }

  return res.blob()
}
