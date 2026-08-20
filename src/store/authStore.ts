import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/user'

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated'

interface AuthStore {
  accessToken: string | null
  accessTokenExpiresAt: string | null
  user: User | null
  status: AuthStatus

  setSession: (params: { accessToken: string; accessTokenExpiresAt: string; user: User }) => void
  clear: () => void
  setStatus: (status: AuthStatus) => void
}

function isUnexpired(expiresAt: string | null): boolean {
  return !!expiresAt && new Date(expiresAt).getTime() > Date.now()
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      accessTokenExpiresAt: null,
      user: null,
      status: 'idle',

      setSession: ({ accessToken, accessTokenExpiresAt, user }) =>
        set({ accessToken, accessTokenExpiresAt, user, status: 'authenticated' }),
      clear: () =>
        set({
          accessToken: null,
          accessTokenExpiresAt: null,
          user: null,
          status: 'unauthenticated',
        }),
      setStatus: (status) => set({ status }),
    }),
    {
      name: 'cv-builder-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        accessTokenExpiresAt: state.accessTokenExpiresAt,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && isUnexpired(state.accessTokenExpiresAt)) {
          state.status = 'authenticated'
        }
      },
    },
  ),
)
