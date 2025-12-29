import { useClassContext } from '@/hooks/use-classes'
import { Skeleton } from '@/components/ui/skeleton'
import { CheckCircle2, BookOpen } from 'lucide-react'

interface ClassContextDisplayProps {
    classId?: string
}

export function ClassContextDisplay({ classId }: ClassContextDisplayProps) {
    const { data, isLoading, error } = useClassContext(classId)

    if (!classId) return null

    if (isLoading) {
        return (
            <div className="mt-2 flex items-center gap-2 p-3 rounded-md bg-muted/50 border border-border/50 animate-pulse">
                <Skeleton className="h-4 w-4 rounded-full" />
                <Skeleton className="h-4 w-32" />
            </div>
        )
    }

    if (error || !data) {
        return null
    }

    return (
        <div className="mt-2 flex items-center gap-2 p-3 rounded-md bg-primary/5 border border-primary/10 text-sm text-primary animate-in fade-in transition-all">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span className="font-medium">Selected: {data.name}</span>
            <span className="text-muted-foreground mx-1">•</span>
            <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Teaching: <span className="text-foreground font-medium">{data.subject}</span></span>
            </div>
        </div>
    )
}
