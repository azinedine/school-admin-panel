import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { Activity, Clock } from 'lucide-react'

interface PrepFormStatusDurationProps {
    control: Control<LessonPreparationFormData>
    disabled?: boolean
    language?: string
}

export function PrepFormStatusDuration({
    control,
    disabled,
    language,
}: PrepFormStatusDurationProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="md:col-span-3 flex gap-2">
            {/* Status */}
            <div className="flex-1">
                <FormField
                    control={control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                                <Activity className="h-3 w-3" />
                                {t('pages.prep.status.label', 'Status')}
                            </FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                disabled={disabled}
                            >
                                <FormControl>
                                    <SelectTrigger className="h-8 text-sm bg-background border-primary/20">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="draft">
                                        {t('pages.prep.status.draft', 'Draft')}
                                    </SelectItem>
                                    <SelectItem value="ready">
                                        {t('pages.prep.status.ready', 'Ready')}
                                    </SelectItem>
                                    <SelectItem value="delivered">
                                        {t('pages.prep.status.delivered', 'Done')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            {/* Duration */}
            <div className="flex-1">
                <FormField
                    control={control}
                    name="duration_minutes"
                    render={({ field }) => (
                        <FormItem className="space-y-1">
                            <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {t('pages.prep.min', 'Min')}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    className="h-8 text-sm bg-background"
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                    disabled={disabled}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}
