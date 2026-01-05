import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { CalendarIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { LessonFormData } from '@/schemas/lesson'

interface LessonFormMetaProps {
    disabled?: boolean
    classes?: string[]
}

export function LessonFormMeta({
    disabled = false,
    classes = [],
}: LessonFormMetaProps) {
    const { t } = useTranslation()
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<LessonFormData>()

    const selectedClass = watch('class_name')
    const selectedStatus = watch('status')

    return (
        <>
            {/* Class */}
            <div>
                <Label htmlFor="class_name">
                    {t('lessons.form.class', 'Class')} *
                </Label>
                <Select
                    value={selectedClass}
                    onValueChange={(value) => setValue('class_name', value)}
                    disabled={disabled}
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
                            <SelectItem value="" disabled>
                                {t('lessons.form.noClasses', 'No classes available')}
                            </SelectItem>
                        )}
                    </SelectContent>
                </Select>
                {errors.class_name && (
                    <p className="mt-1 text-sm text-destructive">{errors.class_name.message}</p>
                )}
            </div>

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
                        disabled={disabled}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
                {errors.lesson_date && (
                    <p className="mt-1 text-sm text-destructive">{errors.lesson_date.message}</p>
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
                    disabled={disabled}
                    placeholder="2024-2025"
                    className="mt-1.5"
                />
                {errors.academic_year && (
                    <p className="mt-1 text-sm text-destructive">{errors.academic_year.message}</p>
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
                    disabled={disabled}
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
                    <p className="mt-1 text-sm text-destructive">{errors.status.message}</p>
                )}
            </div>
        </>
    )
}
