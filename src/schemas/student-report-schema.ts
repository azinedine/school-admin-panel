import { z } from 'zod'

export const sanctionSchema = z.object({
    parent_summons: z.boolean().optional(),
    guidance_counselor_summons: z.boolean().optional(),
    written_warning: z.boolean().optional(),
    disciplinary_council_referral: z.boolean().optional(),
})

export const studentReportSchema = z.object({
    student_id: z.string().min(1, 'Student is required'),
    report_date: z.string().min(1, 'Date is required'),
    incident_description: z.string().min(10, 'Description must be at least 10 characters'),
    sanctions: sanctionSchema.optional(),
    other_sanction: z.string().optional(),
})

export type StudentReportFormValues = z.infer<typeof studentReportSchema>

export interface StudentReport {
    id: number
    report_number: string
    academic_year: string
    report_date: string
    incident_description: string
    sanctions: Record<string, boolean> | null
    other_sanction: string | null
    status: 'draft' | 'finalized'
    student: {
        id: string
        name: string
        class: string | null
    }
    teacher: {
        id: number
        name: string
    }
    created_at: string
}
