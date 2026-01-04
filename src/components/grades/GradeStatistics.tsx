import { Users, TrendingUp, CheckCircle, XCircle } from "lucide-react"
import { useTranslation } from "react-i18next"

export interface GradeStatisticsData {
    total: number
    specialCaseCount: number
    classAverage: string
    passRate: string
    failRate: string
}

interface GradeStatisticsProps {
    statistics: GradeStatisticsData
}

export function GradeStatistics({ statistics }: GradeStatisticsProps) {
    const { t } = useTranslation()

    return (
        <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                    <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">{t('pages.grades.stats.totalStudents')}</p>
                    <p className="text-lg font-bold">{statistics.total}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">{t('pages.grades.stats.classAverage')}</p>
                    <p className="text-lg font-bold">{statistics.classAverage}</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-green-500/10">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">{t('pages.grades.stats.successRate')}</p>
                    <p className="text-lg font-bold text-green-600">{statistics.passRate}%</p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-red-500/10">
                    <XCircle className="h-4 w-4 text-red-500" />
                </div>
                <div>
                    <p className="text-xs text-muted-foreground">{t('pages.grades.stats.failureRate')}</p>
                    <p className="text-lg font-bold text-red-600">{statistics.failRate}%</p>
                </div>
            </div>
        </div>
    )
}

