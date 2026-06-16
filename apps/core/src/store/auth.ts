// ─── DEPRECATED — Use @/hooks/useAuth instead ────────────────────────────────
// Migrated to React Query + API auth service.
// - useCurrentUser()  → replaces reading `user` / `isAuthenticated`
// - useLogin()        → replaces `login()`
// - useLogout()       → replaces `logout()`
// - useUpdateUser()   → replaces `updateUser()`
// -----------------------------------------------------------------------------

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  login:        (user: User) => void
  logout:       () => void
  updateUser:   (updates: Partial<User>) => void
  setHasHydrated: (v: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      login:          (user) => set({ user, isAuthenticated: true }),
      logout:         ()     => set({ user: null, isAuthenticated: false }),
      updateUser:     (updates) => set(s => ({ user: s.user ? { ...s.user, ...updates } : s.user })),
      setHasHydrated: (v)    => set({ _hasHydrated: v }),
    }),
    {
      name: 'sentinel-core-auth',
      partialize: state => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
