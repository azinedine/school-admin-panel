import { TimetableEmptyState } from '@/components/TimetableEmptyState'
import { TimetableSetupDialog } from '@/components/TimetableSetupDialog'
import type { TimetableEntry } from '@/store/prep-store'

interface TimetableSetupProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (entries: Omit<TimetableEntry, 'id'>[]) => Promise<void>
}

export function TimetableSetup({
    open,
    onOpenChange,
    onSave,
}: TimetableSetupProps) {
    return (
        <div className="space-y-6">
            <TimetableEmptyState onSetupClick={() => onOpenChange(true)} />

            <TimetableSetupDialog
                open={open}
                onOpenChange={onOpenChange}
                onSave={onSave}
            />
        </div>
    )
}
