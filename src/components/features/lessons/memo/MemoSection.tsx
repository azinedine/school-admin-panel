import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface MemoSectionProps {
    title: string
    icon?: LucideIcon
    children: React.ReactNode
    className?: string
    variant?: 'default' | 'highlight'
}

export function MemoSection({
    title,
    icon: Icon,
    children,
    className,
    variant = 'default'
}: MemoSectionProps) {
    return (
        <section className={cn(
            "rounded-lg border-l-4 overflow-hidden mb-6 break-inside-avoid",
            variant === 'default' ? "bg-white border-primary/20 shadow-sm" : "bg-muted/30 border-secondary",
            className
        )}>
            <div className="bg-muted/10 px-4 py-3 border-b border-border/50 flex items-center gap-2">
                {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
                <h3 className="font-semibold text-lg text-foreground/80 tracking-tight">
                    {title}
                </h3>
            </div>
            <div className="p-5">
                {children}
            </div>
        </section>
    )
}
