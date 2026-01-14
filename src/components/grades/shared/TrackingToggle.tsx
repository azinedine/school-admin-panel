import { memo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, Circle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

export interface TrackingToggleProps {
    /** Whether the tracking item is marked as done */
    checked: boolean
    /** Callback when the toggle is clicked */
    onToggle: () => void
    /** Optional timestamp of last completion */
    lastCompletedAt?: string | null
    /** Type of tracking for accessibility and tooltips */
    type: 'oral_interrogation' | 'notebook_checked'
    /** Whether the toggle is currently loading/saving */
    isLoading?: boolean
    /** Whether the toggle is disabled (e.g., read-only mode) */
    disabled?: boolean
    /** Additional class names */
    className?: string
}

/**
 * TrackingToggle - A reusable toggle component for pedagogical tracking
 * 
 * Displays a visual toggle for tracking student activities like
 * oral interrogation and notebook reviews.
 */
export const TrackingToggle = memo(function TrackingToggle({
    checked,
    onToggle,
    lastCompletedAt,
    type,
    isLoading = false,
    disabled = false,
    className,
}: TrackingToggleProps) {
    const { t, i18n } = useTranslation()

    const handleClick = useCallback(() => {
        if (!isLoading && !disabled) {
            onToggle()
        }
    }, [onToggle, isLoading, disabled])

    // Format the date for display
    const formattedDate = lastCompletedAt
        ? new Intl.DateTimeFormat(i18n.language, {
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(new Date(lastCompletedAt))
        : null

    // Get the appropriate tooltip content
    const tooltipKey = type === 'oral_interrogation'
        ? checked
            ? 'pages.grades.tracking.interrogatedOn'
            : 'pages.grades.tracking.markAsInterrogated'
        : checked
            ? 'pages.grades.tracking.notebookCheckedOn'
            : 'pages.grades.tracking.markNotebookChecked'

    const tooltipContent = checked && formattedDate
        ? `${t(tooltipKey)}: ${formattedDate}`
        : t(tooltipKey)

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClick}
                        disabled={disabled || isLoading}
                        className={cn(
                            'h-8 w-8 p-0 transition-colors',
                            checked
                                ? 'text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-500 dark:hover:text-green-400 dark:hover:bg-green-950'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted',
                            className
                        )}
                        aria-label={t(tooltipKey)}
                        aria-pressed={checked}
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : checked ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Circle className="h-4 w-4" />
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">{tooltipContent}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
})
