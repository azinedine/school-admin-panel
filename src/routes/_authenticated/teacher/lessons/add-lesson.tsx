import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, CheckCircle } from 'lucide-react'
import type { LessonTemplate } from '@/store/prep-store'
import { ContentPage } from '@/components/layout/content-page'
import { LessonLibrary } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonLibrary'
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { usePrepStore } from '@/store/prep-store'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MemoLibrary } from '@/components/MemoLibrary'
import { LessonPageNav } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonPageNav'

const ACADEMIC_YEARS: Array<LessonTemplate['academicYear']> = ['1st', '2nd', '3rd', '4th']

function AddLessonPage() {
  const { t } = useTranslation()
  const addLessonTemplate = usePrepStore((state) => state.addLessonTemplate)
  const updateLessonTemplate = usePrepStore((state) => state.updateLessonTemplate)
  const deleteLessonTemplate = usePrepStore((state) => state.deleteLessonTemplate)
  const allLessons = usePrepStore((state) => state.getAllLessonTemplates())

  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null)

  const [formData, setFormData] = useState<Omit<LessonTemplate, 'id' | 'createdAt'>>({
    academicYear: '1st',
    lessonTitle: '',
    field: '',
    learningSegment: '',
    knowledgeResource: '',
    lessonElements: [''],
    assessment: '',
    lessonContent: '',
    practiceNotes: '',
  })

  const handleInputChange = (field: keyof typeof formData, value: string | string[]) => {
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
      academicYear: '1st',
      lessonTitle: '',
      field: '',
      learningSegment: '',
      knowledgeResource: '',
      lessonElements: [''],
      assessment: '',
      lessonContent: '',
      practiceNotes: '',
    })
    setEditingId(null)
  }

  const handleEdit = (lesson: LessonTemplate) => {
    setFormData({
      academicYear: lesson.academicYear,
      lessonTitle: lesson.lessonTitle,
      field: lesson.field,
      learningSegment: lesson.learningSegment,
      knowledgeResource: lesson.knowledgeResource,
      lessonElements: lesson.lessonElements,
      assessment: lesson.assessment,
      lessonContent: lesson.lessonContent,
      practiceNotes: lesson.practiceNotes,
    })
    setEditingId(lesson.id)
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDuplicate = (lesson: LessonTemplate) => {
    setFormData({
      academicYear: lesson.academicYear,
      lessonTitle: `${lesson.lessonTitle} (Copy)`,
      field: lesson.field,
      learningSegment: lesson.learningSegment,
      knowledgeResource: lesson.knowledgeResource,
      lessonElements: lesson.lessonElements,
      assessment: lesson.assessment,
      lessonContent: lesson.lessonContent,
      practiceNotes: lesson.practiceNotes,
    })
    setEditingId(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDeleteClick = (id: string) => {
    setLessonToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (lessonToDelete) {
      deleteLessonTemplate(lessonToDelete)
      toast.success(t('pages.addLesson.deleteSuccess'))
      setLessonToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      // Update existing template
      updateLessonTemplate(editingId, formData)
      toast.success(t('common.updateSuccess') || 'Template updated successfully')
    } else {
      // Add new template
      // Check for duplicates
      const isDuplicate = allLessons.some(
        (lesson) =>
          lesson.academicYear === formData.academicYear &&
          lesson.lessonTitle.trim().toLowerCase() === formData.lessonTitle.trim().toLowerCase() &&
          lesson.field?.trim().toLowerCase() === formData.field?.trim().toLowerCase() &&
          lesson.learningSegment?.trim().toLowerCase() === formData.learningSegment?.trim().toLowerCase() &&
          lesson.knowledgeResource?.trim().toLowerCase() === formData.knowledgeResource?.trim().toLowerCase()
      )

      if (isDuplicate) {
        toast.error(t('pages.addLesson.duplicateLesson'), {
          description: t('pages.addLesson.duplicateLessonDesc'),
        })
        return
      }

      addLessonTemplate(formData)
      toast.success(t('pages.addLesson.success'), {
        description: formData.lessonTitle,
      })
    }

    resetForm()
  }

  return (
    <ContentPage
      title={t('nav.lessonManagement')}
    >
      <Tabs defaultValue="lessons" className="space-y-6">
        {/* Page Navigation */}
        <LessonPageNav />

        <TabsList>
          <TabsTrigger value="lessons">{t('pages.addLesson.title')}</TabsTrigger>
          <TabsTrigger value="memos">{t('pages.prep.memos.title')}</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Lesson Creation Form */}
            <div className="space-y-6">
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4 pb-6 border-b">
                    <h3 className="text-lg font-semibold">
                      {t('pages.prep.sections.basicInfo')}
                    </h3>

                    <div className="space-y-4">
                      {/* Academic Year Selector */}
                      <div className="space-y-2">
                        <Label htmlFor="academicYear" className="required">
                          {t('pages.addLesson.academicYear')}
                        </Label>
                        <Select
                          value={formData.academicYear}
                          onValueChange={(value: LessonTemplate['academicYear']) =>
                            handleInputChange('academicYear', value)
                          }
                          required
                        >
                          <SelectTrigger id="academicYear">
                            <SelectValue
                              placeholder={t('pages.addLesson.academicYearPlaceholder')}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {ACADEMIC_YEARS.map((year) => (
                              <SelectItem key={year} value={year}>
                                {t(`pages.addLesson.years.${year}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Lesson Title */}
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
                      {formData.lessonElements.map((element, index) => (
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
                      ))}
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
                      {editingId ? t('common.update') : t('common.save')}
                    </Button>
                    {editingId && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetForm}
                      >
                        {t('common.cancel')}
                      </Button>
                    )}
                  </div>
                </form>
              </Card>
            </div>

            {/* Right Column: Lesson Library */}
            <div className="space-y-6">
              <LessonLibrary
                lessons={allLessons}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onDuplicate={handleDuplicate}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="memos">
          <MemoLibrary />
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pages.addLesson.deleteConfirm')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              {t('pages.addLesson.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentPage >
  )
}

export const Route = createFileRoute('/_authenticated/teacher/lessons/add-lesson')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user?.role === 'parent') {
      throw redirect({
        to: '/unauthorized',
      })
    }
  },
  component: AddLessonPage,
})
