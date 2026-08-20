import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { fetchCurrentUser } from '@/services/authService'

export function AuthCallbackPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  useEffect(() => {
    const error = params.get('error')
    const accessToken = params.get('access_token')
    const accessTokenExpiresAt = params.get('access_token_expires_at')

    if (error || !accessToken || !accessTokenExpiresAt) {
      navigate(`/login?error=${error ?? 'oauth_failed'}`, { replace: true })
      return
    }

    fetchCurrentUser(accessToken)
      .then(({ user }) => {
        setSession({ accessToken, accessTokenExpiresAt, user })
        navigate('/', { replace: true })
      })
      .catch(() => navigate('/login?error=oauth_failed', { replace: true }))
  }, [params, navigate, setSession])

  return null
}
