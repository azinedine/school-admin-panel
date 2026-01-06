import { type Control } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'
import { GraduationCap } from 'lucide-react'

interface PrepFormLevelProps {
    control: Control<LessonPreparationFormData>
    disabled?: boolean
    language?: string
    levels: string[]
}

export function PrepFormLevel({
    control,
    disabled,
    language,
    levels,
}: PrepFormLevelProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="md:col-span-3">
            <FormField
                control={control}
                name="level"
                render={({ field }) => (
                    <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {t('pages.prep.level', 'Level')}
                        </FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={disabled}
                        >
                            <FormControl>
                                <SelectTrigger className="h-8 text-sm bg-background">
                                    <SelectValue placeholder={t('pages.prep.selectLevel')} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {levels.length > 0 ? (
                                    levels.map((l) => (
                                        <SelectItem key={l} value={l}>
                                            {l}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="none" disabled>
                                        {t('pages.prep.noLevels')}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    )
}
