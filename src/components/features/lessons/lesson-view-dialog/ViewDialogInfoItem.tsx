import type { ReactNode } from 'react'

interface ViewDialogInfoItemProps {
    icon: ReactNode
    label: string
    value: string
}

export function ViewDialogInfoItem({
    icon,
    label,
    value,
}: ViewDialogInfoItemProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="p-2 bg-muted rounded-md shrink-0">{icon}</div>
            <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    )
}
