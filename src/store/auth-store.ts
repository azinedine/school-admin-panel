/**
 * Auth Store
 * 
 * Manages authentication state:
 * - Token storage/persistence
 * - Authentication flag derived from token presence
 * - User data for synchronous access (route guards, etc.)
 * 
 * Note: While TanStack Query is the primary source of user data for components,
 * the store keeps a copy for synchronous access needed in route guards.
 * 
 * @example
 * ```tsx
 * const isAuthenticated = useAuthStore(s => s.isAuthenticated)
 * const token = useAuthStore(s => s.token)
 * const user = useAuthStore(s => s.user)
 * ```
 */

import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'
import { authStorage } from './storage'
import type { User } from './types'

// =============================================================================
// Types
// =============================================================================

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  user: User | null
}

interface AuthActions {
  setToken: (token: string) => void
  clearToken: () => void
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

type AuthStore = AuthState & AuthActions

// =============================================================================
// Initial State
// =============================================================================

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
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
         */
        clearToken: () =>
          set(
            initialState,
            false,
            'auth/clearToken'
          ),

        /**
         * Login with user data and token
         */
        login: (user, token) =>
          set(
            {
              user,
              token,
              isAuthenticated: true,
            },
            false,
            'auth/login'
          ),

        /**
         * Logout - clear all auth state
         */
        logout: () =>
          set(
            initialState,
            false,
            'auth/logout'
          ),

        /**
         * Update user data (e.g., after profile fetch)
         */
        updateUser: (user) =>
          set(
            { user },
            false,
            'auth/updateUser'
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
export const useCurrentUser = () => useAuthStore((state) => state.user)
