import { z } from 'zod'

/**
 * Teacher Create Form Schema
 * Validates all fields for creating a new teacher account
 */

export const teacherFormSchema = z.object({
  // Personal Information
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  name_ar: z.string().optional(),
  gender: z.enum(['male', 'female']),
  date_of_birth: z.string().optional(),

  // Professional Information
  teacher_id: z.string().optional(),
  subjects: z.array(z.string()).default([]),
  levels: z.array(z.string()).default([]),
  years_of_experience: z.coerce.number().min(0).optional(),
  employment_status: z.enum(['active', 'inactive', 'on_leave']).default('active'),

  // Contact Information
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  wilaya_id: z.coerce.number().min(1, 'Please select a wilaya'),
  municipality_id: z.coerce.number().min(1, 'Please select a municipality'),
  address: z.string().optional(),

  // Account Settings
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirmation: z.string(),
  
  // Fixed role
  role: z.literal('teacher').default('teacher'),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation'],
})

export type TeacherFormData = z.infer<typeof teacherFormSchema>

/**
 * Default values for the form
 */
export const teacherFormDefaults = {
  name: '',
  name_ar: '',
  gender: 'male' as const,
  date_of_birth: '',
  teacher_id: '',
  subjects: [] as string[],
  levels: [] as string[],
  years_of_experience: undefined,
  employment_status: 'active' as const,
  email: '',
  phone: '',
  wilaya_id: 0,
  municipality_id: 0,
  address: '',
  password: '',
  password_confirmation: '',
  role: 'teacher' as const,
}
