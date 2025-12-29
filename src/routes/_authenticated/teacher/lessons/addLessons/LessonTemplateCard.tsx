import type { LessonTemplate } from '@/store/prep-store'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, Trash2, Copy } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface LessonTemplateCardProps {
  lesson: LessonTemplate
  onEdit: () => void
  onDelete: () => void
  onDuplicate: () => void
}

export function LessonTemplateCard({
  lesson,
  onEdit,
  onDelete,
  onDuplicate,
}: LessonTemplateCardProps) {
  const { t } = useTranslation()

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{lesson.lessonTitle}</h3>
            {lesson.field && (
              <p className="text-sm text-muted-foreground">{lesson.field}</p>
            )}
          </div>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {t(`pages.addLesson.years.${lesson.academicYear}`)}
          </span>
        </div>

        {/* Content Preview */}
        <div className="space-y-2 text-sm">
          {lesson.learningSegment && (
            <div>
              <span className="font-medium">{t('pages.prep.lessonStructure.learningSegment')}: </span>
              <span className="text-muted-foreground">{lesson.learningSegment}</span>
            </div>
          )}
          {lesson.lessonElements && lesson.lessonElements.length > 0 && (
            <div>
              <span className="font-medium">{t('pages.prep.lessonElements.title')}: </span>
              <span className="text-muted-foreground">
                {lesson.lessonElements.length} {t('pages.addLesson.lessonsCount', { count: lesson.lessonElements.length })}
              </span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Edit2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('pages.addLesson.edit')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
