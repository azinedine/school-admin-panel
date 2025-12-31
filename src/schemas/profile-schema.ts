import { z } from 'zod'

// Helper for optional string that handles empty string
const optionalString = z.string().optional().transform(val => val === '' ? undefined : val)

// Create a function that accepts a translation function
export const createProfileSchema = (t: (key: string) => string) => {
    return z.object({
        name: z.string().min(2, { message: t('profilePage.validation.nameLength') }),
        name_ar: z.string().optional(),
        email: z.string().email({ message: t('profilePage.validation.emailInvalid') }),
        phone: z.string().optional(), // Could add regex for phone validation here if needed
        address: z.string().optional(),
        gender: z.enum(['male', 'female']).optional(),
        date_of_birth: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
            message: t('profilePage.validation.dateInvalid')
        }),
        wilaya: optionalString,
        municipality: optionalString,
        institution_id: optionalString,
        work_phone: z.string().optional(),
        office_location: z.string().optional(),
        date_of_hiring: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), {
            message: t('profilePage.validation.dateInvalid')
        }),
        years_of_experience: z
            .union([z.string(), z.number()])
            .optional()
            .transform((val) => (val === '' ? undefined : Number(val))),
        subjects: z.string().optional(),
    })
}

// Export the schema type
export type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>
