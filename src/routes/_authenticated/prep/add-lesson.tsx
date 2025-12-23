import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Calendar, Plus, Trash2, CheckCircle } from 'lucide-react'
import { ContentPage } from '@/components/layout/content-page'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
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
import { useGradesStore } from '@/store/grades-store'
import { usePrepStore } from '@/store/prep-store'
import { toast } from 'sonner'

function AddLessonPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const classes = useGradesStore((state) => state.classes)
  const addPlanEntry = usePrepStore((state) => state.addPlanEntry)

  const [formData, setFormData] = useState({
    class: '',
    date: '',
    lessonTitle: '',
    field: '',
    learningSegment: '',
    knowledgeResource: '',
    lessonElements: [''],
    assessment: '',
    lessonContent: '',
    practiceNotes: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleElementChange = (index: number, value: string) => {
    const newElements = [...formData.lessonElements]
    newElements[index] = value
    setFormData((prev) => ({ ...prev, lessonElements: newElements }))
  }

  const addElement = () => {
    setFormData((prev) => ({
      ...prev,
      lessonElements: [...prev.lessonElements, ''],
    }))
  }

  const removeElement = (index: number) => {
    if (formData.lessonElements.length > 1) {
      const newElements = formData.lessonElements.filter((_, i) => i !== index)
      setFormData((prev) => ({ ...prev, lessonElements: newElements }))
    }
  }

  const resetForm = () => {
    setFormData({
      class: '',
      date: '',
      lessonTitle: '',
      field: '',
      learningSegment: '',
      knowledgeResource: '',
      lessonElements: [''],
      assessment: '',
      lessonContent: '',
      practiceNotes: '',
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save lesson to store
    addPlanEntry({
      day: 'sunday', // Default value, can be derived from date
      timeSlot: '08:00-09:00', // Default value
      class: formData.class,
      mode: 'fullClass',
      group: 'first',
      lessonTitle: formData.lessonTitle,
      lessonContent: formData.lessonContent,
      practiceNotes: formData.practiceNotes,
      date: formData.date,
      field: formData.field,
      learningSegment: formData.learningSegment,
      knowledgeResource: formData.knowledgeResource,
      lessonElements: formData.lessonElements.filter((el) => el.trim() !== ''),
      assessment: formData.assessment,
    })

    toast.success(t('pages.addLesson.success'), {
      description: formData.lessonTitle,
    })

    resetForm()
  }

  // No classes available state
  if (classes.length === 0) {
    return (
      <ContentPage
        title={t('pages.addLesson.title')}
        description={t('pages.addLesson.description')}
      >
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Calendar className="h-16 w-16 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {t('pages.addLesson.noClassesAvailable')}
              </h2>
              <Button
                onClick={() => navigate({ to: '/grades' })}
                className="mt-4"
              >
                {t('nav.grades.title')}
              </Button>
            </div>
          </div>
        </Card>
      </ContentPage>
    )
  }

  return (
    <ContentPage
      title={t('pages.addLesson.title')}
      description={t('pages.addLesson.description')}
      headerActions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: '/prep' })}
        >
          <Calendar className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          {t('pages.addLesson.viewPreparation')}
        </Button>
      }
    >
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="text-lg font-semibold">
              {t('pages.prep.sections.basicInfo')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="class" className="required">
                  {t('pages.addLesson.selectClass')}
                </Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => handleInputChange('class', value)}
                  required
                >
                  <SelectTrigger id="class">
                    <SelectValue
                      placeholder={t('pages.addLesson.selectClassPlaceholder')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.name}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="required">
                  {t('pages.prep.date')}
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lessonTitle" className="required">
                {t('pages.prep.lessonTitle')}
              </Label>
              <Input
                id="lessonTitle"
                value={formData.lessonTitle}
                onChange={(e) =>
                  handleInputChange('lessonTitle', e.target.value)
                }
                placeholder={t('pages.prep.lessonTitle')}
                required
              />
            </div>
          </div>

          {/* Lesson Structure */}
          <div className="space-y-4 pb-6 border-b">
            <h3 className="text-lg font-semibold">
              {t('pages.prep.lessonStructure.title')}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="field">
                  {t('pages.prep.lessonStructure.field')}
                </Label>
                <Input
                  id="field"
                  value={formData.field}
                  onChange={(e) => handleInputChange('field', e.target.value)}
                  placeholder={t('pages.prep.lessonStructure.fieldPlaceholder')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="learningSegment">
                  {t('pages.prep.lessonStructure.learningSegment')}
                </Label>
                <Input
                  id="learningSegment"
                  value={formData.learningSegment}
                  onChange={(e) =>
                    handleInputChange('learningSegment', e.target.value)
                  }
                  placeholder={t(
                    'pages.prep.lessonStructure.learningSegmentPlaceholder'
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="knowledgeResource">
                  {t('pages.prep.lessonStructure.knowledgeResource')}
                </Label>
                <Input
                  id="knowledgeResource"
                  value={formData.knowledgeResource}
                  onChange={(e) =>
                    handleInputChange('knowledgeResource', e.target.value)
                  }
                  placeholder={t(
                    'pages.prep.lessonStructure.knowledgeResourcePlaceholder'
                  )}
                />
              </div>
            </div>
          </div>

          {/* Lesson Elements */}
          <div className="space-y-4 pb-6 border-b">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {t('pages.prep.lessonElements.title')}
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addElement}
              >
                <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                {t('pages.prep.lessonElements.addElement')}
              </Button>
            </div>

            <div className="space-y-3">
              {formData.lessonElements.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {t('pages.prep.lessonElements.noElements')}
                </p>
              ) : (
                formData.lessonElements.map((element, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label htmlFor={`element-${index}`}>
                        {t('pages.prep.lessonElements.elementNumber', {
                          number: index + 1,
                        })}
                      </Label>
                      <Input
                        id={`element-${index}`}
                        value={element}
                        onChange={(e) =>
                          handleElementChange(index, e.target.value)
                        }
                        placeholder={t(
                          'pages.prep.lessonElements.elementPlaceholder'
                        )}
                      />
                    </div>
                    {formData.lessonElements.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeElement(index)}
                        className="mt-8"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Content & Evaluation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t('pages.prep.sections.contentEvaluation')}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="lessonContent">
                  {t('pages.prep.lessonContent')}
                </Label>
                <Textarea
                  id="lessonContent"
                  value={formData.lessonContent}
                  onChange={(e) =>
                    handleInputChange('lessonContent', e.target.value)
                  }
                  placeholder={t('pages.prep.lessonContent')}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessment">
                  {t('pages.prep.assessment')}
                </Label>
                <Textarea
                  id="assessment"
                  value={formData.assessment}
                  onChange={(e) =>
                    handleInputChange('assessment', e.target.value)
                  }
                  placeholder={t('pages.prep.assessmentPlaceholder')}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="practiceNotes">
                  {t('pages.prep.practiceNotes')}
                </Label>
                <Textarea
                  id="practiceNotes"
                  value={formData.practiceNotes}
                  onChange={(e) =>
                    handleInputChange('practiceNotes', e.target.value)
                  }
                  placeholder={t('pages.prep.practiceNotes')}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <Button type="submit" className="flex-1">
              <CheckCircle className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('common.save')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/prep' })}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </Card>
    </ContentPage>
  )
}

export const Route = createFileRoute('/_authenticated/prep/add-lesson')({
  component: AddLessonPage,
})
