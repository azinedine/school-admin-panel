/**
 * Common types used across Zustand stores
 */

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student' | 'parent'
  avatar?: string
  // Profile fields
  wilaya?: string
  municipality?: string
  institution?: string
  subjects?: string[]
  levels?: string[]
  class?: string
  linkedStudentId?: string
  created_at: string
  can?: {
    viewAny: boolean
    create: boolean
    update: boolean
    delete: boolean
  }
}

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}
