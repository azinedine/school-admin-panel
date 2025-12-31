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
import { type LessonPreparationFormData } from '@/schemas/lesson-preparation'

import { Calendar, Clock, GraduationCap, Hash, Layout, Activity } from 'lucide-react'

interface LessonHeaderProps {
    control: Control<LessonPreparationFormData>
    isLoading?: boolean
    language?: string
    subjects: string[]
    levels: string[]
}

export function LessonHeader({
    control,
    isLoading,
    language,
    subjects,
    levels
}: LessonHeaderProps) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    return (
        <div className="bg-muted/10 border-b">
            <div className="p-4 space-y-4">
                {/* Top Row: Basic Identifier Info */}
                <div className="grid grid-cols-2 md:grid-cols-12 gap-3 items-start">

                    {/* Lesson Number */}
                    <div className="md:col-span-1">
                        <FormField
                            control={control}
                            name="lesson_number"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                                        <Hash className="h-3 w-3" />
                                        {t('pages.prep.id', 'ID')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="h-8 text-sm font-medium bg-background"
                                            placeholder="#"
                                            {...field}
                                            disabled={isLoading}
                                            min={1}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Subject */}
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger className="h-8 text-sm bg-background">
                                                <SelectValue placeholder={t('pages.prep.selectSubject')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {subjects.length > 0 ? (
                                                subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)
                                            ) : <SelectItem value="General" disabled>{t('pages.prep.noSubjects')}</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Level */}
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                        <FormControl>
                                            <SelectTrigger className="h-8 text-sm bg-background">
                                                <SelectValue placeholder={t('pages.prep.selectLevel')} />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {levels.length > 0 ? (
                                                levels.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)
                                            ) : <SelectItem value="none" disabled>{t('pages.prep.noLevels')}</SelectItem>}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Date */}
                    <div className="md:col-span-2">
                        <FormField
                            control={control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {t('pages.prep.date', 'Date')}
                                    </FormLabel>
                                    <FormControl>
                                        <Input type="date" className="h-8 text-sm bg-background" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Status & Duration (Combined or adjacent) */}
                    <div className="md:col-span-3 flex gap-2">
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
                                            <FormControl>
                                                <SelectTrigger className="h-8 text-sm bg-background border-primary/20">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="draft">{t('pages.prep.status.draft', 'Draft')}</SelectItem>
                                                <SelectItem value="ready">{t('pages.prep.status.ready', 'Ready')}</SelectItem>
                                                <SelectItem value="delivered">{t('pages.prep.status.delivered', 'Done')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}
