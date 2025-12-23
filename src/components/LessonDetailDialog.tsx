import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
    date: '',
    status: undefined as 'completed' | 'postponed' | 'deleted' | undefined,
    statusNote: '',
    field: '',
    learningSegment: '',
    knowledgeResource: '',
    lessonElements: [] as string[],
    assessment: '',
  })

  // Load existing lesson data or prefilled class when dialog opens
  useEffect(() => {
    if (existingLesson) {
      setFormData({
        class: existingLesson.class,
        lessonTitle: existingLesson.lessonTitle,
        lessonContent: existingLesson.lessonContent,
        practiceNotes: existingLesson.practiceNotes,
        date: existingLesson.date || '',
        status: existingLesson.status,
        statusNote: existingLesson.statusNote || '',
        field: existingLesson.field || '',
        learningSegment: existingLesson.learningSegment || '',
        knowledgeResource: existingLesson.knowledgeResource || '',
        lessonElements: existingLesson.lessonElements || [],
        assessment: existingLesson.assessment || '',
      })
    } else {
      // Reset form for new lesson, use prefilled class if available
      setFormData({
        class: prefilledClass || '',
        lessonTitle: '',
        lessonContent: '',
        practiceNotes: '',
        date: '',
        status: undefined,
        statusNote: '',
        field: '',
        learningSegment: '',
        knowledgeResource: '',
        lessonElements: [],
        assessment: '',
      })
    }
  }, [existingLesson, prefilledClass, open])

  const handleSave = () => {
    if (!formData.class.trim() || !formData.lessonTitle.trim() || !formData.date.trim()) {
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
        mode: 'groups', // Default mode
        ...formData,
      })
    }

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingLesson ? t('pages.prep.editLesson') : t('pages.prep.addLesson')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              {t('pages.prep.sections.basicInfo')}
            </h3>
            
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
              <Label htmlFor="date">{t('pages.prep.date')} *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
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
              <Label htmlFor="status">{t('pages.prep.status.label')}</Label>
              <Select
                value={formData.status || 'none'}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  status: value === 'none' ? undefined : value as 'completed' | 'postponed' | 'deleted',
                  statusNote: value === 'none' ? '' : formData.statusNote
                })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('pages.prep.status.none')}</SelectItem>
                  <SelectItem value="completed">{t('pages.prep.status.completed')}</SelectItem>
                  <SelectItem value="postponed">{t('pages.prep.status.postponed')}</SelectItem>
                  <SelectItem value="deleted">{t('pages.prep.status.deleted')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.status === 'postponed' || formData.status === 'deleted') && (
              <div className="grid gap-2">
                <Label htmlFor="statusNote">
                  {formData.status === 'postponed' ? t('pages.prep.status.postponedReason') : t('pages.prep.status.deletedReason')}
                </Label>
                <Textarea
                  id="statusNote"
                  value={formData.statusNote}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, statusNote: e.target.value })}
                  placeholder={formData.status === 'postponed' ? t('pages.prep.status.postponedPlaceholder') : t('pages.prep.status.deletedPlaceholder')}
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Section 2: Lesson Structure */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              {t('pages.prep.sections.structure')}
            </h3>

            <div className="grid gap-2">
              <Label htmlFor="field">{t('pages.prep.lessonStructure.field')}</Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                placeholder={t('pages.prep.lessonStructure.fieldPlaceholder')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="learningSegment">{t('pages.prep.lessonStructure.learningSegment')}</Label>
              <Input
                id="learningSegment"
                value={formData.learningSegment}
                onChange={(e) => setFormData({ ...formData, learningSegment: e.target.value })}
                placeholder={t('pages.prep.lessonStructure.learningSegmentPlaceholder')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="knowledgeResource">{t('pages.prep.lessonStructure.knowledgeResource')}</Label>
              <Input
                id="knowledgeResource"
                value={formData.knowledgeResource}
                onChange={(e) => setFormData({ ...formData, knowledgeResource: e.target.value })}
                placeholder={t('pages.prep.lessonStructure.knowledgeResourcePlaceholder')}
              />
            </div>
          </div>

          {/* Section 3: Lesson Elements */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              {t('pages.prep.sections.elements')}
            </h3>

            {formData.lessonElements.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                {t('pages.prep.lessonElements.noElements')}
              </p>
            ) : (
              <div className="space-y-2">
                {formData.lessonElements.map((element, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t('pages.prep.lessonElements.elementNumber', { number: index + 1 })}
                        </span>
                      </div>
                      <Input
                        value={element}
                        onChange={(e) => {
                          const newElements = [...formData.lessonElements]
                          newElements[index] = e.target.value
                          setFormData({ ...formData, lessonElements: newElements })
                        }}
                        placeholder={t('pages.prep.lessonElements.elementPlaceholder')}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newElements = formData.lessonElements.filter((_, i) => i !== index)
                        setFormData({ ...formData, lessonElements: newElements })
                      }}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  lessonElements: [...formData.lessonElements, '']
                })
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('pages.prep.lessonElements.addElement')}
            </Button>
          </div>

          {/* Section 4: Content & Evaluation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              {t('pages.prep.sections.contentEvaluation')}
            </h3>

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
              <Label htmlFor="assessment">{t('pages.prep.assessment')}</Label>
              <Textarea
                id="assessment"
                value={formData.assessment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, assessment: e.target.value })}
                placeholder={t('pages.prep.assessmentPlaceholder')}
                rows={3}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.class.trim() || !formData.lessonTitle.trim() || !formData.date.trim()}
          >
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
