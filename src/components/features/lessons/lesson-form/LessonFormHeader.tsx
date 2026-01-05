import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { LessonFormData } from '@/schemas/lesson'

interface LessonFormHeaderProps {
    disabled?: boolean
}

export function LessonFormHeader({ disabled = false }: LessonFormHeaderProps) {
    const { t } = useTranslation()
    const {
        register,
        formState: { errors },
    } = useFormContext<LessonFormData>()

    return (
        <div className="md:col-span-2">
            <Label htmlFor="title">
                {t('lessons.form.title', 'Lesson Title')} *
            </Label>
            <Input
                id="title"
                {...register('title')}
                disabled={disabled}
                placeholder={t('lessons.form.titlePlaceholder', 'Enter lesson title')}
                className="mt-1.5"
            />
            {errors.title && (
                <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
            )}
        </div>
    )
}
