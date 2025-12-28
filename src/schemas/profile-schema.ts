import { z } from 'zod'

// Helper for optional string that handles empty string
const optionalString = z.string().optional().transform(val => val === '' ? undefined : val)

export const profileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    name_ar: z.string().optional(),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(), // Could add regex for phone validation here if needed
    address: z.string().optional(),
    gender: z.enum(['male', 'female']).optional(),
    date_of_birth: z.coerce.date().optional(),
    wilaya: optionalString,
    municipality: optionalString,
    user_institution_id: optionalString,
    work_phone: z.string().optional(),
    office_location: z.string().optional(),
    date_of_hiring: z.coerce.date().optional(),
    years_of_experience: z
        .union([z.string(), z.number()])
        .optional()
        .transform((val) => (val === '' ? undefined : Number(val))),
})

export type ProfileFormValues = z.infer<typeof profileSchema>
