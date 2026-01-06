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
import { Layout } from 'lucide-react'

interface PrepFormSubjectProps {
    control: Control<LessonPreparationFormData>
    disabled?: boolean
    language?: string
    subjects: string[]
}

export function PrepFormSubject({
    control,
    disabled,
    language,
    subjects,
}: PrepFormSubjectProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="md:col-span-3">
            <FormField
                control={control}
                name="subject"
                render={({ field }) => (
                    <FormItem className="space-y-1">
                        <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                            <Layout className="h-3 w-3" />
                            {t('pages.prep.subject', 'Subject')}
                        </FormLabel>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={disabled}
                        >
                            <FormControl>
                                <SelectTrigger className="h-8 text-sm bg-background">
                                    <SelectValue placeholder={t('pages.prep.selectSubject')} />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {subjects.length > 0 ? (
                                    subjects.map((s) => (
                                        <SelectItem key={s} value={s}>
                                            {s}
                                        </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="General" disabled>
                                        {t('pages.prep.noSubjects')}
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
