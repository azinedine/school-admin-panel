/**
 * User Types
 */

import type { Wilaya, Municipality } from '@/hooks/use-institutions'

export type UserRole = 'super_admin' | 'admin' | 'manager' | 'teacher' | 'student' | 'parent'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
    id: number
    name: string
    email: string
    role: UserRole
    status: UserStatus
    avatar?: string

    // Location
    wilaya?: Wilaya
    municipality?: Municipality

    // Institution
    institution_id?: number
    institution?: {
        id: number
        name: string
        name_ar?: string
        type?: string
    }
    user_institution_id?: string

    // Profile
    name_ar?: string
    gender?: 'male' | 'female'
    date_of_birth?: string
    address?: string
    phone?: string

    // Teacher specific
    teacher_id?: string
    years_of_experience?: number
    employment_status?: string
    weekly_teaching_load?: number
    subjects?: string[]
    levels?: string[]
    assigned_classes?: string[]
    groups?: string[]

    // Admin/Staff specific
    department?: string
    position?: string
    date_of_hiring?: string
    work_phone?: string
    office_location?: string
    notes?: string

    // Timestamps
    created_at: string
    updated_at?: string
    last_login_at?: string
}

export interface UpdateUserPayload {
    name?: string
    name_ar?: string
    email?: string
    phone?: string
    address?: string
    gender?: 'male' | 'female'
    date_of_birth?: string
    wilaya?: string
    municipality?: string
    institution_id?: string
    work_phone?: string
    office_location?: string
    date_of_hiring?: string
    years_of_experience?: number
}
