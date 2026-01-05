import { Skeleton } from '@/components/ui/skeleton'

export function ClassContextSkeleton() {
    return (
        <div className="mt-2 flex items-center gap-2 p-3 rounded-md bg-muted/50 border border-border/50 animate-pulse">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-32" />
        </div>
    )
}
