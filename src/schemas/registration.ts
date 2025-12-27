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
    subjects: z.array(z.string())
      .default([])
      .superRefine((val, ctx) => {
        if (val.length === 0) return z.NEVER; // Optional validation handled by min(1) if required, but prompt implies required for teacher? Let's check. 
        // Prompt doesn't explicitly say required, but usually teachers have subjects. I'll stick to rules.
        
        const hasArabic = val.includes('arabic');
        const hasIslamic = val.includes('islamic');
        const hasHistory = val.includes('history'); // History & Geography
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
            // Strict pairs check
            const isValidCombination =
                (hasArabic && hasIslamic) || // Arabic + Islamic ONLY
                (hasHistory && hasCivic);    // History + Civic ONLY

            if (!isValidCombination) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: t('auth.validation.invalidSubjectCombination'),
                });
            }
        }
    }),
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

  // Admin-specific fields
  const adminFields = z.object({
    employeeId: z.string().min(1, t('auth.validation.employeeIdRequired')),
    department: z.string().min(1, t('auth.validation.departmentRequired')),
    position: z.string().min(1, t('auth.validation.positionRequired')),
    dateOfHiring: z.string().min(1, t('auth.validation.hiringDateRequired')),
    officeLocation: z.string().min(1, t('auth.validation.officeLocationRequired')),
    workPhone: z.string().min(1, t('auth.validation.workPhoneRequired')),
    supervisorId: z.string().optional(),
    notes: z.string().optional(),
  })

  // Combined schema
  return baseSchema.merge(teacherFields).merge(studentFields).merge(parentFields).merge(adminFields)
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

  // Admin fields
  employeeId: '',
  department: '',
  position: '',
  dateOfHiring: '',
  officeLocation: '',
  workPhone: '',
  supervisorId: '',
  notes: '',
}
