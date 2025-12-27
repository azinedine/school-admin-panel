import { z } from 'zod'

/**
 * Registration Form Schema
 * Validates all fields for user registration across all roles
 */

// Helper to create the schema with translations
export const createRegistrationSchema = (t: (key: string) => string) => {
  // Base schema for all roles
  const baseSchema = z.object({
    // Step 1: Account Info
    name: z.string().min(2, t('auth.validation.nameLength')),
    email: z.string().email(t('auth.validation.emailInvalid')),
    password: z.string().min(8, t('auth.validation.passwordLength')),
    role: z.enum(['admin', 'teacher', 'student', 'parent']),
    
    // Step 2: Location (common to all)
    wilaya: z.string().min(1, t('auth.validation.wilayaRequired')),
    municipality: z.string().min(1, t('auth.validation.municipalityRequired')),
    institution: z.string().min(1, t('auth.validation.institutionRequired')),
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
  return baseSchema.merge(teacherFields).merge(studentFields).merge(parentFields)
}

// Export type based on a dummy schema (structure remains constant)
const dummySchema = createRegistrationSchema((key) => key)
export type RegistrationFormData = z.infer<typeof dummySchema>

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
