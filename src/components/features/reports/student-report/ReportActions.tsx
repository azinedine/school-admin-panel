import { Button } from '@/components/ui/button'
import { Printer, Save, X, Loader2, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface ReportActionsProps {
    onCancel: () => void
    isSubmitting: boolean
    isDraft?: boolean
    onPrint?: () => void
}

export function ReportActions({
    onCancel,
    isSubmitting,
    isDraft = true,
    onPrint
}: ReportActionsProps) {
    const { t } = useTranslation()

    return (
        <div className="pt-6 mt-6 border-t">
            {/* Action Buttons */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                {/* Left side - Cancel */}
                <Button
                    variant="ghost"
                    type="button"
                    onClick={onCancel}
                    className="text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t('common.cancel', 'Cancel')}
                </Button>

                {/* Right side - Primary actions */}
                <div className="flex gap-2">
                    {!isDraft && (
                        <Button
                            variant="outline"
                            type="button"
                            onClick={onPrint || (() => window.print())}
                        >
                            <Printer className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            {t('common.print', 'Print')}
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="min-w-[140px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />
                                {t('common.saving', 'Saving...')}
                            </>
                        ) : isDraft ? (
                            <>
                                <Save className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                                {t('reports.actions.saveReport', 'Save Report')}
                            </>
                        ) : (
                            <>
                                <CheckCircle className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                                {t('reports.actions.finalize', 'Finalize')}
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {/* Help text */}
            {isDraft && (
                <p className="text-xs text-muted-foreground text-center sm:text-right mt-4">
                    {t('reports.actions.draftHint', 'Reports can be edited until finalized')}
                </p>
            )}
        </div>
    )
}
