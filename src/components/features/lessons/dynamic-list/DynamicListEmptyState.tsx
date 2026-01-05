interface DynamicListEmptyStateProps {
    message: string
}

export function DynamicListEmptyState({ message }: DynamicListEmptyStateProps) {
    return (
        <div className="text-sm text-muted-foreground italic px-4 py-2 bg-muted/20 rounded-md border border-dashed">
            {message}
        </div>
    )
}
