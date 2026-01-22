import { User, GraduationCap, Calendar, UserCog } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface StudentInfoBlockProps {
    studentName: string
    className: string
    date: string
    teacherName: string
}

export function StudentInfoBlock({ studentName, className, date, teacherName }: StudentInfoBlockProps) {
    const { t } = useTranslation()

    const infoItems = [
        {
            icon: User,
            label: t('reports.studentReport.student', 'Student'),
            value: studentName,
            highlight: true,
        },
        {
            icon: GraduationCap,
            label: t('reports.studentReport.class', 'Class'),
            value: className,
        },
        {
            icon: Calendar,
            label: t('reports.studentReport.reportDate', 'Report Date'),
            value: date,
        },
        {
            icon: UserCog,
            label: t('reports.studentReport.teacher', 'Reporting Teacher'),
            value: teacherName,
        },
    ]

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                {t('reports.studentReport.involvedParties', 'Involved Parties')}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {infoItems.map((item) => (
                    <div
                        key={item.label}
                        className={`
                            flex items-start gap-3 p-3 rounded-lg border bg-card
                            ${item.highlight ? 'border-primary/30 bg-primary/5' : 'border-border'}
                        `}
                    >
                        <div className={`
                            shrink-0 h-9 w-9 rounded-lg flex items-center justify-center
                            ${item.highlight ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                        `}>
                            <item.icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs text-muted-foreground">{item.label}</p>
                            <p className={`font-medium truncate ${item.highlight ? 'text-base' : 'text-sm'}`}>
                                {item.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
