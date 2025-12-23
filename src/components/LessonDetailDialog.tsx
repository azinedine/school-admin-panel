import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { type DailyPlanEntry } from '@/store/prep-store'

interface LessonDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (lesson: Omit<DailyPlanEntry, 'id'>) => void
  onUpdate?: (id: string, updates: Partial<DailyPlanEntry>) => void
  day: string
  timeSlot: string
  group: string
  prefilledClass?: string
  existingLesson?: DailyPlanEntry
}

export function LessonDetailDialog({
  open,
  onOpenChange,
  onSave,
  onUpdate,
  day,
  timeSlot,
  group,
  prefilledClass,
  existingLesson,
}: LessonDetailDialogProps) {
  const { t } = useTranslation()
  
  const [formData, setFormData] = useState({
    class: '',
    lessonTitle: '',
    lessonContent: '',
    practiceNotes: '',
  })

  // Load existing lesson data or prefilled class when dialog opens
  useEffect(() => {
    if (existingLesson) {
      setFormData({
        class: existingLesson.class,
        lessonTitle: existingLesson.lessonTitle,
        lessonContent: existingLesson.lessonContent,
        practiceNotes: existingLesson.practiceNotes,
      })
    } else {
      // Reset form for new lesson, use prefilled class if available
      setFormData({
        class: prefilledClass || '',
        lessonTitle: '',
        lessonContent: '',
        practiceNotes: '',
      })
    }
  }, [existingLesson, prefilledClass, open])

  const handleSave = () => {
    if (!formData.class.trim() || !formData.lessonTitle.trim()) {
      return // Basic validation
    }

    if (existingLesson && onUpdate) {
      // Update existing lesson
      onUpdate(existingLesson.id, formData)
    } else {
      // Create new lesson
      onSave({
        day: day as DailyPlanEntry['day'],
        timeSlot,
        group: group as DailyPlanEntry['group'],
        ...formData,
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {existingLesson ? t('pages.prep.editLesson') : t('pages.prep.addLesson')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="class">{t('pages.prep.class')}</Label>
            <Input
              id="class"
              value={formData.class}
              readOnly
              disabled
              className="bg-muted cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">
              {t('pages.prep.classFromTimetable')}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lessonTitle">{t('pages.prep.lessonTitle')} *</Label>
            <Input
              id="lessonTitle"
              value={formData.lessonTitle}
              onChange={(e) => setFormData({ ...formData, lessonTitle: e.target.value })}
              placeholder={t('pages.prep.lessonTitle')}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lessonContent">{t('pages.prep.lessonContent')}</Label>
            <Textarea
              id="lessonContent"
              value={formData.lessonContent}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, lessonContent: e.target.value })}
              placeholder={t('pages.prep.lessonContent')}
              rows={4}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="practiceNotes">{t('pages.prep.practiceNotes')}</Label>
            <Textarea
              id="practiceNotes"
              value={formData.practiceNotes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, practiceNotes: e.target.value })}
              placeholder={t('pages.prep.practiceNotes')}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.class.trim() || !formData.lessonTitle.trim()}
          >
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
