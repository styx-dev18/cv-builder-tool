import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { refreshSession } from '@/services/authService'

export function useAuthBootstrap() {
  const location = useLocation()
  const setSession = useAuthStore((s) => s.setSession)
  const clear = useAuthStore((s) => s.clear)
  const setStatus = useAuthStore((s) => s.setStatus)
  const bootstrapped = useRef(false)

  useEffect(() => {
    // AuthCallbackPage establishes the session itself from the OAuth
    // redirect's access_token. Rotating the refresh token here at the same
    // time would revoke that access_token before it's used (JTIMatcher
    // only allows one valid JWT per user at a time).
    if (location.pathname.startsWith('/auth/callback')) return
    // Run the validation pass once per app load, not on every navigation -
    // a persisted, still-valid access token already set status optimistically
    // (see authStore's onRehydrateStorage), so re-running per route change
    // just flashes `loading` and re-hits the network for no reason.
    if (bootstrapped.current) return
    bootstrapped.current = true

    const hasOptimisticSession = useAuthStore.getState().status === 'authenticated'
    if (!hasOptimisticSession) setStatus('loading')

    refreshSession()
      .then((session) =>
        setSession({
          accessToken: session.access_token,
          accessTokenExpiresAt: session.access_token_expires_at,
          user: session.user,
        }),
      )
      .catch(() => clear())
  }, [location.pathname, setSession, clear, setStatus])
}
