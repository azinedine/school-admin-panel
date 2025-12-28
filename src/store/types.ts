/**
 * Common types used across Zustand stores
 */

export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'manager' | 'super_admin'
  avatar?: string
  // Profile fields
  wilaya?: string
  municipality?: string
  institution?: {
    id: number
    name: string
  }
  subjects?: string[]
  levels?: string[]
  class?: string
  linkedStudentId?: string

  // Extended Profile
  name_ar?: string
  gender?: 'male' | 'female'
  date_of_birth?: string
  address?: string
  phone?: string

  // Teacher Specific
  teacher_id?: string
  years_of_experience?: number
  employment_status?: string
  weekly_teaching_load?: number
  assigned_classes?: string[] // Mock/Future
  groups?: string[] // Mock/Future

  // Admin/Staff specific fields
  department?: string
  position?: string
  date_of_hiring?: string
  work_phone?: string
  office_location?: string
  notes?: string
  created_at: string
  updated_at?: string
  last_login_at?: string
  status: 'active' | 'inactive' | 'suspended'
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
