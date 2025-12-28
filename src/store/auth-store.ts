/**
 * Auth Store (Minimal)
 * 
 * This store ONLY handles client state for authentication:
 * - Token storage/persistence
 * - Authentication flag derived from token presence
 * 
 * All server state (user data, permissions) is managed by TanStack Query.
 * This follows the principle: "TanStack Query = sole owner of server state"
 * 
 * @example
 * ```tsx
 * const isAuthenticated = useAuthStore(s => s.isAuthenticated)
 * const token = useAuthStore(s => s.token)
 * ```
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { authStorage } from './storage'

// =============================================================================
// Types
// =============================================================================

interface AuthState {
  token: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  setToken: (token: string) => void
  clearToken: () => void
}

type AuthStore = AuthState & AuthActions

// =============================================================================
// Initial State
// =============================================================================

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
}

// =============================================================================
// Store Implementation
// =============================================================================

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        /**
         * Set token after successful login.
         * User data is NOT stored here - it lives in TanStack Query cache.
         */
        setToken: (token) =>
          set(
            {
              token,
              isAuthenticated: true,
            },
            false,
            'auth/setToken'
          ),

        /**
         * Clear token on logout.
         * Query cache should be cleared separately via queryClient.clear()
         */
        clearToken: () =>
          set(
            initialState,
            false,
            'auth/clearToken'
          ),
      }),
      {
        name: 'auth-storage',
        storage: createJSONStorage(() => authStorage),
      }
    ),
    { name: 'AuthStore' }
  )
)

// =============================================================================
// Selectors
// =============================================================================

export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useToken = () => useAuthStore((state) => state.token)
