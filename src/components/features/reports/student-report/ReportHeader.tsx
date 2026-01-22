import { FileWarning, Building2, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'

interface ReportHeaderProps {
    institutionName: string
    academicYear: string
    reportNumber?: string
    status?: 'draft' | 'finalized'
}

export function ReportHeader({
    institutionName,
    academicYear,
    reportNumber,
    status = 'draft'
}: ReportHeaderProps) {
    const { t } = useTranslation()

    return (
        <div className="relative pb-6 mb-6">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-destructive/5 via-destructive/10 to-destructive/5 rounded-t-lg -mx-8 -mt-8 px-8 pt-8 pb-12" />

            <div className="relative">
                {/* Top Row - Status Badge */}
                <div className="flex justify-between items-start mb-4">
                    <Badge
                        variant={status === 'finalized' ? 'default' : 'secondary'}
                        className="text-xs"
                    >
                        {status === 'finalized'
                            ? t('reports.status.finalized', 'Finalized')
                            : t('reports.status.draft', 'Draft')}
                    </Badge>
                    {reportNumber && (
                        <span className="text-xs font-mono text-muted-foreground">
                            #{reportNumber}
                        </span>
                    )}
                </div>

                {/* Main Header */}
                <div className="flex flex-col items-center text-center space-y-3">
                    <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <FileWarning className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {t('reports.studentReport.title', 'Student Disciplinary Report')}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {t('reports.studentReport.subtitle', 'Official documentation of student conduct')}
                        </p>
                    </div>
                </div>

                {/* Institution Info */}
                <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 border">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{institutionName}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 border">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{academicYear}</span>
                    </div>
                </div>
            </div>

            {/* Decorative Border */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
    )
}
