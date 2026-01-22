import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { studentReportSchema, type StudentReportFormValues } from '@/schemas/student-report-schema'
import { ReportHeader } from './ReportHeader'
import { StudentInfoBlock } from './StudentInfoBlock'
import { IncidentSection } from './IncidentSection'
import { SanctionsSelector } from './SanctionsSelector'
import { ReportActions } from './ReportActions'
import { Card } from '@/components/ui/card'
import { useCreateStudentReport } from '@/hooks/use-student-reports'
import { toast } from 'sonner'

interface StudentReportFormProps {
    student: {
        id: string
        name: string
        className: string
    }
    teacher: {
        id: number
        name: string
    }
    institutionName: string
    academicYear: string
    reportNumber?: string
    status?: 'draft' | 'finalized'
    onSuccess?: () => void
    onCancel: () => void
}

export function StudentReportForm({
    student,
    teacher,
    institutionName,
    academicYear,
    reportNumber,
    status = 'draft',
    onSuccess,
    onCancel
}: StudentReportFormProps) {
    const { t } = useTranslation()
    const { mutate: createReport, isPending } = useCreateStudentReport()

    const methods = useForm<StudentReportFormValues>({
        resolver: zodResolver(studentReportSchema),
        defaultValues: {
            student_id: student.id,
            report_date: new Date().toISOString().split('T')[0],
            sanctions: {},
            incident_description: ''
        }
    })

    const onSubmit = (data: StudentReportFormValues) => {
        createReport(data, {
            onSuccess: () => {
                toast.success(t('reports.toast.created', 'Report created successfully'))
                onSuccess?.()
            },
            onError: (error) => {
                toast.error(t('reports.toast.error', 'Failed to create report'))
                console.error(error)
            }
        })
    }

    return (
        <Card className="max-w-3xl mx-auto bg-card shadow-xl border-0 overflow-hidden print:shadow-none print:border">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    {/* Header Section */}
                    <div className="px-6 sm:px-8 pt-8">
                        <ReportHeader
                            institutionName={institutionName}
                            academicYear={academicYear}
                            reportNumber={reportNumber}
                            status={status}
                        />
                    </div>

                    {/* Main Content */}
                    <div className="px-6 sm:px-8 pb-8 space-y-8">
                        {/* Step 1: Involved Parties */}
                        <StudentInfoBlock
                            studentName={student.name}
                            className={student.className}
                            date={new Date().toLocaleDateString()}
                            teacherName={teacher.name}
                        />

                        {/* Step 2: Incident Description */}
                        <IncidentSection />

                        {/* Step 3: Sanctions */}
                        <SanctionsSelector />

                        {/* Actions */}
                        <ReportActions
                            onCancel={onCancel}
                            isSubmitting={isPending}
                            isDraft={status === 'draft'}
                        />
                    </div>
                </form>
            </FormProvider>
        </Card>
    )
}
