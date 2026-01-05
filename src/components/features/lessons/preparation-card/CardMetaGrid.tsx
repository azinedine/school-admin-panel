interface CardMetaGridProps {
    domain: string
    learningUnit: string
}

export function CardMetaGrid({ domain, learningUnit }: CardMetaGridProps) {
    return (
        <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-muted/40 p-2 rounded-md border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    Domain
                </p>
                <p className="text-xs font-medium truncate" title={domain}>
                    {domain}
                </p>
            </div>
            <div className="bg-muted/40 p-2 rounded-md border border-border/50">
                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">
                    Unit
                </p>
                <p className="text-xs font-medium truncate" title={learningUnit}>
                    {learningUnit}
                </p>
            </div>
        </div>
    )
}
