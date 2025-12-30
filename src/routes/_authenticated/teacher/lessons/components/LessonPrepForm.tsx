import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import {
    Loader2,
    BookOpen,
    FileText
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Form,
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
import { Textarea } from '@/components/ui/textarea'
import {
    type LessonPreparationFormData,
    type LessonPreparationApiPayload,
    type LessonPreparation,
    lessonPreparationFormSchema,
    defaultFormValues,
    toFormData,
    toApiPayload
} from '@/schemas/lesson-preparation'
import { LessonPrepPedagogicalContext } from './LessonPrepPedagogicalContext'
import { LessonPrepElements } from './LessonPrepElements'
import { LessonPrepEvaluation } from './LessonPrepEvaluation'

interface LessonPrepFormProps {
    initialData?: LessonPreparation | null
    subjects?: string[]
    levels?: string[]
    onCancel?: () => void
    isLoading?: boolean
    language?: string
    onSubmit: (data: LessonPreparationApiPayload) => Promise<void>
}

export function LessonPrepForm({
    initialData,
    subjects = [],
    levels = [],
    onCancel,
    isLoading,
    language,
    onSubmit
}: LessonPrepFormProps) {
    const { t: originalT, i18n } = useTranslation()
    // Use fixed language if provided, otherwise default to i18n
    const t = language ? i18n.getFixedT(language) : originalT

    const form = useForm<LessonPreparationFormData>({
        resolver: zodResolver(lessonPreparationFormSchema),
        defaultValues: initialData ? toFormData(initialData) : defaultFormValues,
    })

    const handleSubmit = async (data: LessonPreparationFormData) => {
        const payload = toApiPayload(data)
        await onSubmit(payload)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                {/* 1. Context & Setup */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Basic Info Card */}
                    <Card className="h-full overflow-hidden border-2 shadow-sm">
                        <CardHeader className="bg-muted/30 pb-4 border-b">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle className="text-lg">{t('pages.prep.basicInfo', 'Basic Information')}</CardTitle>
                                    <CardDescription>{t('pages.prep.basicInfoDesc', 'Lesson title, class and date')}</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t('pages.prep.lessonTitle', 'Lesson Title')}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t('pages.prep.lessonTitlePlaceholder', '')}
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('pages.prep.subject', 'Subject')}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('pages.prep.selectSubject', 'Select subject')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {subjects.length > 0 ? (
                                                        subjects.map((subject) => (
                                                            <SelectItem key={subject} value={subject}>
                                                                {subject}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="General" disabled>
                                                            {t('pages.prep.noSubjects', 'No subjects assigned')}
                                                        </SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="class"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('pages.prep.level', 'Level')}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                disabled={isLoading}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder={t('pages.prep.selectLevel', 'Select level')} />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {levels.length > 0 ? (
                                                        levels.map((level) => (
                                                            <SelectItem key={level} value={level}>
                                                                {level}
                                                            </SelectItem>
                                                        ))
                                                    ) : (
                                                        <SelectItem value="none" disabled>{t('pages.prep.noLevels', 'No levels assigned')}</SelectItem>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('pages.prep.date', 'Date')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    {...field}
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="duration_minutes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('pages.prep.duration', 'Duration (min)')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
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
                        </CardContent>
                    </Card>

                    {/* Pedagogical Identification (New) */}
                    <div className="h-full">
                        <LessonPrepPedagogicalContext
                            control={form.control}
                            isLoading={isLoading}
                            language={language}
                        />
                    </div>
                </div>

                {/* 2. Lesson Content (Dynamic Elements) */}
                <LessonPrepElements
                    control={form.control}
                    isLoading={isLoading}
                    language={language}
                />

                {/* 3. Evaluation Section (New) */}
                <LessonPrepEvaluation
                    control={form.control}
                    isLoading={isLoading}
                    language={language}
                />

                {/* Legacy / Additional Info (Collapsible or just below) */}
                <Card className="border-2 shadow-sm overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4 border-b">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-lg">{t('pages.prep.legacy.additional', 'Additional Information')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        {/* Status Field */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('pages.prep.preparationStatus', 'Preparation Status')}</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={isLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="draft">{t('pages.prep.status.draft', 'Draft (Work in Progress)')}</SelectItem>
                                            <SelectItem value="ready">{t('pages.prep.status.ready', 'Ready to Teach')}</SelectItem>
                                            <SelectItem value="delivered">{t('pages.prep.status.delivered', 'Mark as Delivered')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{t('pages.prep.notes', 'Notes')}</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder={t('pages.prep.notesPlaceholder', 'Any private notes...')}
                                            className="min-h-[80px]"
                                            {...field}
                                            disabled={isLoading}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 sticky bottom-0 bg-background/95 backdrop-blur py-4 border-t mt-8 z-10">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            {t('common.cancel', 'Cancel')}
                        </Button>
                    )}
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? t('pages.prep.update', 'Update Preparation') : t('pages.prep.create', 'Create Preparation')}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
