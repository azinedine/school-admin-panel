import { Button } from '@/components/ui/button'
import { Printer, Save, X } from 'lucide-react'

interface ReportActionsProps {
    onCancel: () => void
    isSubmitting: boolean
    isDraft?: boolean
}

export function ReportActions({ onCancel, isSubmitting, isDraft = true }: ReportActionsProps) {
    return (
        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
            <Button variant="outline" type="button" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
            </Button>

            {!isDraft && (
                <Button variant="secondary" type="button" onClick={() => window.print()}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print
                </Button>
            )}

            {isDraft && (
                <Button type="submit" disabled={isSubmitting}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmitting ? 'Saving...' : 'Save Report'}
                </Button>
            )}
        </div>
    )
}
