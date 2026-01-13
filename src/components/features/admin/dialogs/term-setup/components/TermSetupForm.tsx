import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TermSetupFormProps {
    t: (key: string, options?: any) => string
    startDate: string
    endDate: string
    onStartDateChange: (value: string) => void
    onEndDateChange: (value: string) => void
    error: string
    weekCount: number | null
}

export function TermSetupForm({
    t,
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    error,
    weekCount
}: TermSetupFormProps) {
    return (
        <div className="space-y-4 py-4">
            {/* Start Date */}
            <div className="grid gap-2">
                <Label htmlFor="start-date">
                    {t('pages.prep.termSetup.startDate')} *
                </Label>
                <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                />
            </div>

            {/* End Date */}
            <div className="grid gap-2">
                <Label htmlFor="end-date">
                    {t('pages.prep.termSetup.endDate')} *
                </Label>
                <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                />
            </div>

            {/* Error Message */}
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}

            {/* Info Message */}
            {weekCount !== null && (
                <p className="text-sm text-muted-foreground">
                    {t('pages.prep.termSetup.weekCount', { count: weekCount })}
                </p>
            )}
        </div>
    )
}
