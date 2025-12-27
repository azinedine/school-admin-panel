import { z } from 'zod'

/**
 * Teacher Profile Schema - Validates API response before rendering
 * Used with TanStack Query for type-safe data fetching
 */

export const teacherProfileSchema = z.object({
  id: z.number(),
  name: z.string(),
  name_ar: z.string().optional().nullable(),
  email: z.string().email(),
  role: z.literal('teacher'),
  avatar: z.string().optional().nullable(),
  
  // Personal info
  gender: z.enum(['male', 'female']).optional().nullable(),
  date_of_birth: z.string().optional().nullable(),
  
  // Professional info
  teacher_id: z.string().optional().nullable(),
  subjects: z.array(z.string()).optional().nullable(),
  levels: z.array(z.string()).optional().nullable(),
  years_of_experience: z.number().optional().nullable(),
  employment_status: z.enum(['active', 'inactive', 'on_leave']).optional().nullable(),
  
  // Contact info
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  wilaya: z.string().optional().nullable(),
  municipality: z.string().optional().nullable(),
  
  // Institution
  institution: z.object({
    id: z.number(),
    name: z.string(),
  }).optional().nullable(),
  
  // Academic assignments
  assigned_classes: z.array(z.string()).optional().nullable(),
  groups: z.array(z.string()).optional().nullable(),
  weekly_teaching_load: z.number().optional().nullable(),
  
  // Account info
  status: z.enum(['active', 'inactive', 'suspended']),
  created_at: z.string(),
  updated_at: z.string().optional().nullable(),
})

export type TeacherProfile = z.infer<typeof teacherProfileSchema>

/**
 * Validates teacher profile data from API
 * Returns parsed data or throws on validation failure
 */
export function validateTeacherProfile(data: unknown): TeacherProfile {
  return teacherProfileSchema.parse(data)
}

/**
 * Safe validation that returns result object instead of throwing
 */
export function safeValidateTeacherProfile(data: unknown) {
  return teacherProfileSchema.safeParse(data)
}
