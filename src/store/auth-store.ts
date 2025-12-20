import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User } from './types'
import { authStorage } from './storage'

/**
 * Authentication Store State
 */
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

/**
 * Authentication Store Actions
 */
interface AuthActions {
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

/**
 * Combined Auth Store Type
 */
type AuthStore = AuthState & AuthActions

/**
 * Initial state for auth store
 */
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

/**
 * Authentication Store
 * 
 * Handles user authentication state with IndexedDB persistence.
 * 
 * @example
 * ```tsx
 * import { useAuthStore } from '@/store/auth-store'
 * 
 * function LoginButton() {
 *   const { login, logout, isAuthenticated, user } = useAuthStore()
 *   
 *   const handleLogin = async () => {
 *     const response = await api.login(credentials)
 *     login(response.user, response.token)
 *   }
 *   
 *   return isAuthenticated ? (
 *     <div>
 *       <p>Welcome, {user?.name}</p>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   ) : (
 *     <button onClick={handleLogin}>Login</button>
 *   )
 * }
 * ```
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        /**
         * Login user and save authentication data
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
         * Logout user and clear authentication data
         */
        logout: () =>
          set(
            initialState,
            false,
            'auth/logout'
          ),

        /**
         * Update user profile data
         */
        updateUser: (userData) =>
          set(
            (state) => ({
              user: state.user ? { ...state.user, ...userData } : null,
            }),
            false,
            'auth/updateUser'
          ),
      }),
      {
        name: 'auth-storage',
        storage: authStorage as any, // Using IndexedDB
      }
    ),
    { name: 'AuthStore' }
  )
)

/**
 * Selector hooks for optimized re-renders
 */
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
