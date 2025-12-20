/**
 * Common types used across Zustand stores
 */

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student'
  avatar?: string
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}
