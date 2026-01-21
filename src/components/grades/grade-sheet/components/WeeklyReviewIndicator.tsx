import { memo } from 'react'
import { ClipboardCheck, AlertTriangle } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { ObservationType, StudentWeeklyReviewSummary } from '@/features/weekly-reviews'

interface WeeklyReviewIndicatorProps {
    /** Summary of the student's weekly review status */
    summary: StudentWeeklyReviewSummary | null
    /** Callback when the indicator is clicked to open review panel */
    onOpenReviewPanel?: () => void
    /** Tooltip text for reviewed state */
    reviewedTooltip: string
    /** Tooltip text for pending alert state */
    pendingAlertTooltip: string
    /** Function to get localized observation type */
    getObservationLabel?: (type: ObservationType) => string
}

/**
 * WeeklyReviewIndicator - Shows a student's weekly review status at a glance.
 *
 * Display states:
 * - No indicator: Not reviewed recently
 * - ClipboardCheck (gray): Reviewed last week, no issues
 * - ClipboardCheck (amber): Reviewed last week, has issue but resolved
 * - AlertTriangle (orange): Pending alert - needs follow-up
 */
export const WeeklyReviewIndicator = memo(function WeeklyReviewIndicator({
    summary,
    onOpenReviewPanel,
    reviewedTooltip,
    pendingAlertTooltip,
    getObservationLabel,
}: WeeklyReviewIndicatorProps) {
    // Don't show anything if no summary or not reviewed recently
    if (!summary || (!summary.reviewed_last_week && !summary.reviewed_this_week)) {
        return null
    }

    const hasPendingAlert = summary.has_pending_alert
    const wasReviewedThisWeek = summary.reviewed_this_week
    const wasReviewedLastWeek = summary.reviewed_last_week
    const lastObservation = summary.last_review?.observation_type
    const hasIssue = lastObservation && lastObservation !== 'OK'

    // Determine which icon and color to show
    let icon: React.ReactNode
    let colorClass: string
    let tooltipText: string

    if (hasPendingAlert) {
        // Pending alert - orange warning
        icon = <AlertTriangle className="h-3.5 w-3.5" />
        colorClass = 'text-orange-500 dark:text-orange-400'
        tooltipText = pendingAlertTooltip
        if (lastObservation && getObservationLabel) {
            tooltipText += `: ${getObservationLabel(lastObservation)}`
        }
    } else if (wasReviewedThisWeek) {
        // Reviewed this week
        icon = <ClipboardCheck className="h-3.5 w-3.5" />
        colorClass = summary.this_week_review?.observation_type !== 'OK'
            ? 'text-amber-500 dark:text-amber-400'
            : 'text-green-500 dark:text-green-400'
        tooltipText = reviewedTooltip
        if (summary.this_week_review?.observation_type && summary.this_week_review.observation_type !== 'OK' && getObservationLabel) {
            tooltipText += `: ${getObservationLabel(summary.this_week_review.observation_type)}`
        }
    } else if (wasReviewedLastWeek) {
        // Reviewed last week (no pending alert means OK or resolved)
        icon = <ClipboardCheck className="h-3.5 w-3.5" />
        colorClass = hasIssue && !summary.last_review?.alert_resolved
            ? 'text-amber-500 dark:text-amber-400'
            : 'text-muted-foreground'
        tooltipText = reviewedTooltip
    } else {
        return null
    }

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        onOpenReviewPanel?.()
    }

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        type="button"
                        onClick={handleClick}
                        className={cn(
                            'inline-flex items-center justify-center ml-1 rtl:ml-0 rtl:mr-1',
                            'rounded-sm p-0.5 transition-colors',
                            'hover:bg-muted focus:outline-none focus:ring-1 focus:ring-ring',
                            colorClass
                        )}
                        aria-label={tooltipText}
                    >
                        {icon}
                    </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs max-w-[200px]">
                    <p>{tooltipText}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
})
