import { z } from 'zod'

/**
 * Registration Form Schema
 * Validates all fields for user registration across all roles
 */

// Base schema for all roles
const baseSchema = z.object({
  // Step 1: Account Info
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['admin', 'teacher', 'student', 'parent']),
  
  // Step 2: Location (common to all)
  wilaya: z.string().min(1, 'Please select a wilaya'),
  municipality: z.string().min(1, 'Please select a municipality'),
  institution: z.string().min(1, 'Please select an institution'),
})

// Teacher-specific fields
const teacherFields = z.object({
  name_ar: z.string().optional(),
  gender: z.enum(['male', 'female']).optional(),
  date_of_birth: z.string().optional(),
  phone: z.string().optional(),
  teacher_id: z.string().optional(),
  years_of_experience: z.coerce.number().min(0).optional(),
  subjects: z.array(z.string()).default([]),
  levels: z.array(z.string()).default([]),
})

// Student-specific fields
const studentFields = z.object({
  class: z.string().optional(),
})

// Parent-specific fields
const parentFields = z.object({
  linkedStudentId: z.string().optional(),
})

// Combined schema
export const registrationSchema = baseSchema.merge(teacherFields).merge(studentFields).merge(parentFields)

export type RegistrationFormData = z.infer<typeof registrationSchema>

/**
 * Default values for the registration form
 */
export const registrationDefaults: RegistrationFormData = {
  // Account
  name: '',
  email: '',
  password: '',
  role: 'student',
  
  // Location
  wilaya: '',
  municipality: '',
  institution: '',
  
  // Teacher fields
  name_ar: '',
  gender: undefined,
  date_of_birth: '',
  phone: '',
  teacher_id: '',
  years_of_experience: undefined,
  subjects: [],
  levels: [],
  
  // Student fields
  class: '',
  
  // Parent fields
  linkedStudentId: '',
}
