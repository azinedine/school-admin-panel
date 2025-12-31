import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'react-i18next'
import { CalendarIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import {
    lessonSchema,
    lessonDefaults,
    type LessonFormData,
    type Lesson,
} from '@/schemas/lesson'

interface LessonFormProps {
    /** Initial data for editing */
    initialData?: Lesson | null
    /** Submit handler */
    onSubmit: (data: LessonFormData) => void
    /** Loading state */
    isLoading?: boolean
    /** Read-only mode - all inputs disabled */
    readOnly?: boolean
    /** Cancel handler */
    onCancel?: () => void
    /** Available classes for selection */
    classes?: string[]
    // NOTE: subjects prop removed - subject is identity-bound to teacher
}

/**
 * Reusable Lesson Form Component
 * Uses React Hook Form with Zod validation
 * Supports create, edit, and read-only modes
 * 
 * NOTE: Subject is NOT included in this form.
 * Subject is derived from the authenticated teacher's profile (identity-bound).
 */
export function LessonForm({
    initialData,
    onSubmit,
    isLoading = false,
    readOnly = false,
    onCancel,
    classes = [],
}: LessonFormProps) {
    const { t } = useTranslation()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LessonFormData>({
        resolver: zodResolver(lessonSchema),
        defaultValues: initialData
            ? {
                title: initialData.title,
                content: initialData.content || '',
                lesson_date: initialData.lesson_date,
                academic_year: initialData.academic_year,
                class_name: initialData.class_name,
                status: initialData.status,
            }
            : lessonDefaults,
    })

    const selectedClass = watch('class_name')
    const selectedStatus = watch('status')

    const handleFormSubmit = (data: LessonFormData) => {
        if (!readOnly) {
            onSubmit(data)
        }
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <Label htmlFor="title">
                                {t('lessons.form.title', 'Lesson Title')} *
                            </Label>
                            <Input
                                id="title"
                                {...register('title')}
                                disabled={readOnly || isLoading}
                                placeholder={t('lessons.form.titlePlaceholder', 'Enter lesson title')}
                                className="mt-1.5"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.title.message}
                                </p>
                            )}
                        </div>

                        {/* Class */}
                        <div>
                            <Label htmlFor="class_name">
                                {t('lessons.form.class', 'Class')} *
                            </Label>
                            <Select
                                value={selectedClass}
                                onValueChange={(value) => setValue('class_name', value)}
                                disabled={readOnly || isLoading}
                            >
                                <SelectTrigger className="mt-1.5">
                                    <SelectValue placeholder={t('lessons.form.selectClass', 'Select class')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.length > 0 ? (
                                        classes.map((cls) => (
                                            <SelectItem key={cls} value={cls}>
                                                {cls}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <>
                                            <SelectItem value="1AS">1AS</SelectItem>
                                            <SelectItem value="2AS">2AS</SelectItem>
                                            <SelectItem value="3AS">3AS</SelectItem>
                                            <SelectItem value="1AM">1AM</SelectItem>
                                            <SelectItem value="2AM">2AM</SelectItem>
                                            <SelectItem value="3AM">3AM</SelectItem>
                                            <SelectItem value="4AM">4AM</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                            {errors.class_name && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.class_name.message}
                                </p>
                            )}
                        </div>

                        {/* NOTE: Subject selector removed - subject is identity-bound to teacher */}

                        {/* Date */}
                        <div>
                            <Label htmlFor="lesson_date">
                                {t('lessons.form.date', 'Lesson Date')} *
                            </Label>
                            <div className="relative mt-1.5">
                                <Input
                                    id="lesson_date"
                                    type="date"
                                    {...register('lesson_date')}
                                    disabled={readOnly || isLoading}
                                />
                                <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            </div>
                            {errors.lesson_date && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.lesson_date.message}
                                </p>
                            )}
                        </div>

                        {/* Academic Year */}
                        <div>
                            <Label htmlFor="academic_year">
                                {t('lessons.form.academicYear', 'Academic Year')} *
                            </Label>
                            <Input
                                id="academic_year"
                                {...register('academic_year')}
                                disabled={readOnly || isLoading}
                                placeholder="2024-2025"
                                className="mt-1.5"
                            />
                            {errors.academic_year && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.academic_year.message}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <Label htmlFor="status">
                                {t('lessons.form.status', 'Status')} *
                            </Label>
                            <Select
                                value={selectedStatus}
                                onValueChange={(value) => setValue('status', value as 'draft' | 'published')}
                                disabled={readOnly || isLoading}
                            >
                                <SelectTrigger className="mt-1.5">
                                    <SelectValue placeholder={t('lessons.form.selectStatus', 'Select status')} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">
                                        {t('lessons.status.draft', 'Draft')}
                                    </SelectItem>
                                    <SelectItem value="published">
                                        {t('lessons.status.published', 'Published')}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.status.message}
                                </p>
                            )}
                        </div>

                        {/* Content */}
                        <div className="md:col-span-2">
                            <Label htmlFor="content">
                                {t('lessons.form.content', 'Lesson Content')}
                            </Label>
                            <Textarea
                                id="content"
                                {...register('content')}
                                disabled={readOnly || isLoading}
                                placeholder={t(
                                    'lessons.form.contentPlaceholder',
                                    'Enter lesson content, objectives, and activities...'
                                )}
                                className="mt-1.5 min-h-[150px]"
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-destructive">
                                    {errors.content.message}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Actions */}
            {!readOnly && (
                <div className="flex justify-end gap-3">
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
                        {initialData
                            ? t('common.update', 'Update')
                            : t('common.create', 'Create')}
                    </Button>
                </div>
            )}
        </form>
    )
}
