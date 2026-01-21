import { FileText } from 'lucide-react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'

interface StudentReportIndicatorProps {
    reportsCount: number
    tooltip: string
}

/**
 * A subtle indicator showing that a student has one or more reports on file.
 * Renders nothing if reportsCount is 0.
 * 
 * Design decisions:
 * - Small icon (h-3.5 w-3.5) to be readable but not intrusive
 * - Amber color to indicate attention without alarm
 * - Tooltip provides context without cluttering the table
 * - Accessible via aria-label
 */
export function StudentReportIndicator({ reportsCount, tooltip }: StudentReportIndicatorProps) {
    if (reportsCount === 0) {
        return null
    }

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span
                        className="inline-flex items-center justify-center ml-1.5 rtl:ml-0 rtl:mr-1.5"
                        aria-label={tooltip}
                    >
                        <FileText className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
                    </span>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                    <p>{tooltip}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}
