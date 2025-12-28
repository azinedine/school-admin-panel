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
    // role: z.enum(['admin', 'teacher', 'student', 'parent']), // Removed, handled by discriminated union

    // Step 2: Location (common to all)
    wilaya: z.string().min(1, t('auth.validation.wilayaRequired')),
    municipality: z.string().min(1, t('auth.validation.municipalityRequired')),
    institution_id: z.string().min(1, t('auth.validation.institutionRequired')),
  })

  // Teacher-specific fields
  const teacherFields = z.object({
    name_ar: z.string().min(1, t('auth.validation.arabicNameRequired')),
    gender: z.enum(['male', 'female'], { message: t('auth.validation.genderRequired') }),
    date_of_birth: z.string().min(1, t('auth.validation.dobRequired')),
    phone: z.string().min(1, t('auth.validation.phoneRequired')),
    years_of_experience: z.coerce.number().min(0, t('auth.validation.experienceRequired')),
    subjects: z.array(z.string())
      .min(1, t('auth.validation.subjectsRequired'))
      .superRefine((val, ctx) => {
        const hasArabic = val.includes('arabic');
        const hasIslamic = val.includes('islamic');
        const hasHistory = val.includes('history');
        const hasCivic = val.includes('civic');

        // Rule: Max 2 subjects allowed
        if (val.length > 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('auth.validation.maxSubjects'),
          });
          return;
        }

        if (val.length === 2) {
          const isValidCombination =
            (hasArabic && hasIslamic) ||
            (hasHistory && hasCivic);

          if (!isValidCombination) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('auth.validation.invalidSubjectCombination'),
            });
          }
        }
      }),
    levels: z.array(z.string()).min(1, t('auth.validation.levelsRequired')),
  })

  // Student-specific fields
  const studentFields = z.object({
    class: z.string().min(1, t('auth.validation.classRequired')),
  })

  // Parent-specific fields
  const parentFields = z.object({
    linkedStudentId: z.string().min(1, t('auth.validation.linkedStudentRequired')),
  })

  // Admin-specific fields
  const adminFields = z.object({
    department: z.string().min(1, t('auth.validation.departmentRequired')),
    position: z.string().min(1, t('auth.validation.positionRequired')),
    dateOfHiring: z.string().min(1, t('auth.validation.hiringDateRequired')),
    officeLocation: z.string().min(1, t('auth.validation.officeLocationRequired')),
    workPhone: z.string().min(1, t('auth.validation.workPhoneRequired')),
    notes: z.string().optional(),
  })

  // Combined schema using discriminated union for conditional validation
  return z.discriminatedUnion('role', [
    baseSchema.extend({ role: z.literal('student') }).merge(studentFields),
    baseSchema.extend({ role: z.literal('teacher') }).merge(teacherFields),
    baseSchema.extend({ role: z.literal('parent') }).merge(parentFields),
    baseSchema.extend({ role: z.literal('admin') }).merge(adminFields),
  ])
}

// Export type based on a dummy schema (structure remains constant)
const dummySchema = createRegistrationSchema((key) => key)
export type RegistrationFormData = z.infer<typeof dummySchema>

// The flat payload structure sent to the backend
export interface RegistrationPayload {
  name: string
  email: string
  password: string
  password_confirmation: string
  role: string
  wilaya: string
  municipality: string
  institution_id: string
  // Optional fields
  name_ar?: string
  gender?: 'male' | 'female'
  date_of_birth?: string
  phone?: string
  years_of_experience?: number
  subjects?: string[]
  levels?: string[]
  class?: string
  linkedStudentId?: string
  // Admin fields
  department?: string
  position?: string
  date_of_hiring?: string
  work_phone?: string
  office_location?: string
  notes?: string
}

// Comprehensive type for the form state (superset of all union members)
export interface RegistrationFormState {
  name: string
  email: string
  password: string
  password_confirmation?: string // Not in payload interface but used in form? Schema doesn't show it but onSubmit uses it.
  role: 'admin' | 'teacher' | 'student' | 'parent' | string // string allowed for initial state
  wilaya: string
  municipality: string
  institution_id: string

  // Optional fields
  name_ar: string
  gender?: 'male' | 'female'
  date_of_birth: string
  phone: string
  years_of_experience?: number
  subjects: string[]
  levels: string[]
  class: string
  linkedStudentId: string

  // Admin fields (CamelCase as per Schema)
  department: string
  position: string
  dateOfHiring: string
  officeLocation: string
  workPhone: string
  notes: string
}

/**
 * Default values for the registration form
 */
export const registrationDefaults: RegistrationFormState = {
  // Account
  name: '',
  email: '',
  password: '',
  role: 'student',

  // Location
  wilaya: '',
  municipality: '',
  institution_id: '',

  // Teacher fields
  name_ar: '',
  gender: undefined,
  date_of_birth: '',
  phone: '',
  years_of_experience: undefined,
  subjects: [],
  levels: [],

  // Student fields
  class: '',

  // Parent fields
  linkedStudentId: '',

  // Admin fields
  department: '',
  position: '',
  dateOfHiring: '',
  officeLocation: '',
  workPhone: '',
  notes: '',
}
