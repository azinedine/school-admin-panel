import { format } from 'date-fns'
import { BookOpen, Clock } from 'lucide-react'
import { CardFooter as UICardFooter } from '@/components/ui/card'

interface CardFooterProps {
    level: string
    durationMinutes: number
    date: string
}

export function CardFooter({ level, durationMinutes, date }: CardFooterProps) {
    return (
        <UICardFooter className="p-4 pt-2 mt-auto border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px] font-medium" title={level}>
                    {level}
                </span>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{durationMinutes}m</span>
                </div>
                <div className="font-medium text-foreground/80">
                    {format(new Date(date), 'MMM d')}
                </div>
            </div>
        </UICardFooter>
    )
}
