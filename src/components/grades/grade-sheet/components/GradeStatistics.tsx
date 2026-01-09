import { Users, TrendingUp, CheckCircle, XCircle } from 'lucide-react'

interface GradeStatisticsProps {
    statistics: {
        total: number
        classAverage: number
        passRate: number
        failRate: number
    }
    t: (key: string) => string
}

export function GradeStatistics({ statistics, t }: GradeStatisticsProps) {
    return (
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                </div>
                <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.totalStudents')}</p>
                    <p className="text-sm sm:text-lg font-bold">{statistics.total}</p>
                </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                </div>
                <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.classAverage')}</p>
                    <p className="text-sm sm:text-lg font-bold">{statistics.classAverage}</p>
                </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                    <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                </div>
                <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.successRate')}</p>
                    <p className="text-sm sm:text-lg font-bold text-green-600">{statistics.passRate}%</p>
                </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
                    <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                </div>
                <div>
                    <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.failureRate')}</p>
                    <p className="text-sm sm:text-lg font-bold text-red-600">{statistics.failRate}%</p>
                </div>
            </div>
        </div>
    )
}
