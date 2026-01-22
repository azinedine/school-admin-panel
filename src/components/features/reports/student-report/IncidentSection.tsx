import { Textarea } from '@/components/ui/textarea'
import { useFormContext, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { AlertCircle, FileText, Info } from 'lucide-react'

const MIN_CHARS = 10
const RECOMMENDED_CHARS = 100

export function IncidentSection() {
    const { t } = useTranslation()
    const { register, control, formState: { errors } } = useFormContext()

    // Watch the field value for character count
    const description = useWatch({ control, name: 'incident_description' }) || ''
    const charCount = description.length

    const getCharCountColor = () => {
        if (charCount < MIN_CHARS) return 'text-destructive'
        if (charCount < RECOMMENDED_CHARS) return 'text-amber-500'
        return 'text-green-500'
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-destructive" />
                    {t('reports.studentReport.incidentDescription', 'Incident Description')}
                </h2>
                <span className={`text-xs font-medium ${getCharCountColor()}`}>
                    {charCount} {t('common.characters', 'characters')}
                </span>
            </div>

            <div className="relative">
                <div className="absolute top-3 left-3 rtl:left-auto rtl:right-3 pointer-events-none">
                    <FileText className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <Textarea
                    id="incident_description"
                    placeholder={t('reports.studentReport.incidentPlaceholder', 'Describe what happened, including the date, time, location, and any witnesses. Be factual and specific...')}
                    className="min-h-[180px] resize-none text-base pl-11 rtl:pl-3 rtl:pr-11 pt-3"
                    {...register('incident_description')}
                />
            </div>

            {errors.incident_description ? (
                <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errors.incident_description.message as string}</span>
                </div>
            ) : (
                <div className="flex items-start gap-2 text-muted-foreground text-xs bg-muted/50 p-3 rounded-lg">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <p className="font-medium">{t('reports.studentReport.tips', 'Writing Tips')}:</p>
                        <ul className="list-disc list-inside space-y-0.5 text-muted-foreground/80">
                            <li>{t('reports.studentReport.tip1', 'Include specific date, time, and location')}</li>
                            <li>{t('reports.studentReport.tip2', 'Describe actions objectively without assumptions')}</li>
                            <li>{t('reports.studentReport.tip3', 'Mention any witnesses or evidence')}</li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}
