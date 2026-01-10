import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
    onSuccess?: () => void
    onCancel: () => void
}

export function StudentReportForm({
    student,
    teacher,
    institutionName,
    academicYear,
    onSuccess,
    onCancel
}: StudentReportFormProps) {
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
                toast.success('Report created successfully')
                onSuccess?.()
            },
            onError: (error) => {
                toast.error('Failed to create report')
                console.error(error)
            }
        })
    }

    return (
        <Card className="max-w-4xl mx-auto p-8 bg-card shadow-lg print:shadow-none print:border-none">
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <ReportHeader
                        institutionName={institutionName}
                        academicYear={academicYear}
                    />

                    <div className="space-y-8">
                        <StudentInfoBlock
                            studentName={student.name}
                            className={student.className}
                            date={new Date().toLocaleDateString()}
                            teacherName={teacher.name}
                        />

                        <IncidentSection />

                        <SanctionsSelector />

                        <ReportActions
                            onCancel={onCancel}
                            isSubmitting={isPending}
                        />
                    </div>
                </form>
            </FormProvider>
        </Card>
    )
}
