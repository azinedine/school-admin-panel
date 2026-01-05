import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { LessonFormData } from '@/schemas/lesson'

interface LessonFormContentProps {
    disabled?: boolean
}

export function LessonFormContent({ disabled = false }: LessonFormContentProps) {
    const { t } = useTranslation()
    const {
        register,
        formState: { errors },
    } = useFormContext<LessonFormData>()

    return (
        <div className="md:col-span-2">
            <Label htmlFor="content">
                {t('lessons.form.content', 'Lesson Content')}
            </Label>
            <Textarea
                id="content"
                {...register('content')}
                disabled={disabled}
                placeholder={t(
                    'lessons.form.contentPlaceholder',
                    'Enter lesson content, objectives, and activities...'
                )}
                className="mt-1.5 min-h-[150px]"
            />
            {errors.content && (
                <p className="mt-1 text-sm text-destructive">{errors.content.message}</p>
            )}
        </div>
    )
}
