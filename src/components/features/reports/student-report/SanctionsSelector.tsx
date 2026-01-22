import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
    Users,
    MessageSquare,
    AlertTriangle,
    Scale,
    Check,
    type LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Sanction {
    id: string
    labelKey: string
    defaultLabel: string
    icon: LucideIcon
    severity: 'low' | 'medium' | 'high'
    description: string
}

const sanctions: Sanction[] = [
    {
        id: 'parent_summons',
        labelKey: 'reports.sanctions.parentSummons',
        defaultLabel: 'Parent Summons',
        icon: Users,
        severity: 'low',
        description: 'Request parent/guardian meeting'
    },
    {
        id: 'guidance_counselor_summons',
        labelKey: 'reports.sanctions.guidanceCounselor',
        defaultLabel: 'Guidance Counselor Referral',
        icon: MessageSquare,
        severity: 'low',
        description: 'Refer to school counselor'
    },
    {
        id: 'written_warning',
        labelKey: 'reports.sanctions.writtenWarning',
        defaultLabel: 'Written Warning',
        icon: AlertTriangle,
        severity: 'medium',
        description: 'Official warning on record'
    },
    {
        id: 'disciplinary_council_referral',
        labelKey: 'reports.sanctions.disciplinaryCouncil',
        defaultLabel: 'Disciplinary Council',
        icon: Scale,
        severity: 'high',
        description: 'Escalate to disciplinary board'
    },
]

const severityColors = {
    low: 'border-green-200 bg-green-50/50 hover:bg-green-50 dark:border-green-800 dark:bg-green-950/30 dark:hover:bg-green-950/50',
    medium: 'border-amber-200 bg-amber-50/50 hover:bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 dark:hover:bg-amber-950/50',
    high: 'border-red-200 bg-red-50/50 hover:bg-red-50 dark:border-red-800 dark:bg-red-950/30 dark:hover:bg-red-950/50',
}

const severityIconColors = {
    low: 'text-green-600 dark:text-green-400',
    medium: 'text-amber-600 dark:text-amber-400',
    high: 'text-red-600 dark:text-red-400',
}

const selectedColors = {
    low: 'border-green-500 bg-green-100 dark:border-green-600 dark:bg-green-950',
    medium: 'border-amber-500 bg-amber-100 dark:border-amber-600 dark:bg-amber-950',
    high: 'border-red-500 bg-red-100 dark:border-red-600 dark:bg-red-950',
}

export function SanctionsSelector() {
    const { t } = useTranslation()
    const { control } = useFormContext()

    // Watch all sanction values
    const sanctionValues = useWatch({ control, name: 'sanctions' }) || {}
    const selectedCount = Object.values(sanctionValues).filter(Boolean).length

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                    {t('reports.studentReport.proposedSanctions', 'Proposed Sanctions')}
                </h2>
                {selectedCount > 0 && (
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                        {selectedCount} {t('common.selected', 'selected')}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sanctions.map((sanction) => (
                    <Controller
                        key={sanction.id}
                        control={control}
                        name={`sanctions.${sanction.id}`}
                        render={({ field }) => {
                            const isSelected = field.value
                            const Icon = sanction.icon

                            return (
                                <button
                                    type="button"
                                    onClick={() => field.onChange(!field.value)}
                                    className={cn(
                                        'relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all',
                                        isSelected
                                            ? selectedColors[sanction.severity]
                                            : severityColors[sanction.severity]
                                    )}
                                >
                                    {/* Selected Indicator */}
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                                            <Check className="h-3 w-3 text-primary-foreground" />
                                        </div>
                                    )}

                                    {/* Icon */}
                                    <div className={cn(
                                        'shrink-0 h-10 w-10 rounded-lg flex items-center justify-center',
                                        isSelected ? 'bg-background/80' : 'bg-background/50',
                                        severityIconColors[sanction.severity]
                                    )}>
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pr-6 rtl:pr-0 rtl:pl-6">
                                        <p className={cn(
                                            'font-medium text-sm',
                                            isSelected && 'text-foreground'
                                        )}>
                                            {t(sanction.labelKey, sanction.defaultLabel)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {sanction.description}
                                        </p>
                                    </div>
                                </button>
                            )
                        }}
                    />
                ))}
            </div>

            {/* Severity Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
                <span className="font-medium">{t('reports.sanctions.severity', 'Severity')}:</span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    {t('reports.sanctions.low', 'Low')}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    {t('reports.sanctions.medium', 'Medium')}
                </span>
                <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    {t('reports.sanctions.high', 'High')}
                </span>
            </div>
        </div>
    )
}
