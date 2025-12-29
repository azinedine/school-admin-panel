import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'
import { useTranslation } from 'react-i18next'
import { Plus, Loader2 } from 'lucide-react'
import { ContentPage } from '@/components/layout/content-page'
import { LessonForm } from '@/components/lessons/LessonForm'
import { LessonCardGrid } from '@/components/lessons/LessonCard'
import { LessonViewDialog } from '@/components/lessons/LessonViewDialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MemoLibrary } from '@/components/MemoLibrary'
import { LessonPageNav } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonPageNav'
import {
  useLessons,
  useCreateLesson,
  useDeleteLesson,
} from '@/hooks/use-lessons'
import type { Lesson, LessonFormData } from '@/schemas/lesson'
import { isLessonDuplicate } from '@/schemas/lesson'
import { toast } from 'sonner'
import { Search, BookOpen, FileEdit, Trash2 } from 'lucide-react'

function AddLessonPage() {
  const { t } = useTranslation()

  // API Integration
  const { data: lessons = [], isLoading: isLoadingLessons } = useLessons()
  const createLesson = useCreateLesson()
  const deleteLesson = useDeleteLesson()

  // Local state
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [viewingLesson, setViewingLesson] = useState<Lesson | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)

  // Filter lessons based on search
  const filteredLessons = lessons.filter((lesson) => {
    const query = searchQuery.toLowerCase()
    return (
      lesson.title.toLowerCase().includes(query) ||
      lesson.class_name.toLowerCase().includes(query) ||
      lesson.subject_name.toLowerCase().includes(query)
    )
  })

  const handleCreateSubmit = (data: LessonFormData) => {
    // Check for duplicates first
    if (isLessonDuplicate(data, lessons)) {
      toast.error('لا يمكن إضافة درس تم إضافته من قبل')
      return
    }

    createLesson.mutate(data, {
      onSuccess: () => {
        setShowForm(false)
        setEditingLesson(null)
      },
    })
  }

  const handleUpdateSubmit = (data: LessonFormData) => {
    if (!editingLesson) return

    // Check for duplicates (excluding current lesson)
    const otherLessons = lessons.filter((l) => l.id !== editingLesson.id)
    if (isLessonDuplicate(data, otherLessons)) {
      toast.error('لا يمكن إضافة درس تم إضافته من قبل')
      return
    }

    // Use API client directly for update
    import('@/lib/api-client').then(({ apiClient }) => {
      apiClient.put(`/v1/lessons/${editingLesson.id}`, data)
        .then(() => {
          toast.success('تم تحديث الدرس بنجاح')
          setShowForm(false)
          setEditingLesson(null)
          // Refetch lessons
          window.location.reload()
        })
        .catch(() => {
          toast.error('فشل في تحديث الدرس')
        })
    })
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleView = (lesson: Lesson) => {
    setViewingLesson(lesson)
  }

  const handleDeleteClick = (lesson: Lesson) => {
    setLessonToDelete(lesson)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (lessonToDelete) {
      deleteLesson.mutate(lessonToDelete.id, {
        onSuccess: () => {
          setLessonToDelete(null)
          setDeleteDialogOpen(false)
        },
      })
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingLesson(null)
  }

  return (
    <ContentPage title={t('nav.lessonManagement')}>
      <Tabs defaultValue="lessons" className="space-y-6">
        {/* Page Navigation */}
        <LessonPageNav />

        <TabsList>
          <TabsTrigger value="lessons">{t('pages.addLesson.title')}</TabsTrigger>
          <TabsTrigger value="memos">{t('pages.prep.memos.title')}</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="space-y-6">
          {/* Header with Actions */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  {t('lessons.library', 'Lesson Library')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {t('lessons.librarySubtitle', '{{count}} lessons', {
                    count: lessons.length,
                  })}
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('common.search', 'Search...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('lessons.create', 'Create Lesson')}
                </Button>
              )}
            </div>
          </div>

          {/* Form Section */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileEdit className="h-5 w-5" />
                  {editingLesson
                    ? t('lessons.edit', 'Edit Lesson')
                    : t('lessons.create', 'Create Lesson')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LessonForm
                  initialData={editingLesson}
                  onSubmit={editingLesson ? handleUpdateSubmit : handleCreateSubmit}
                  isLoading={createLesson.isPending}
                  onCancel={handleCancel}
                />
              </CardContent>
            </Card>
          )}

          {/* Lessons Grid */}
          {isLoadingLessons ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredLessons.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">
                  {searchQuery
                    ? t('lessons.noSearchResults', 'No lessons found')
                    : t('lessons.noLessons', 'No lessons yet')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {searchQuery
                    ? t('lessons.tryDifferentSearch', 'Try a different search term')
                    : t('lessons.createFirst', 'Create your first lesson to get started')}
                </p>
                {!searchQuery && !showForm && (
                  <Button onClick={() => setShowForm(true)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('lessons.create', 'Create Lesson')}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <LessonCardGrid
              lessons={filteredLessons}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          )}
        </TabsContent>

        <TabsContent value="memos">
          <MemoLibrary />
        </TabsContent>
      </Tabs>

      {/* View Dialog */}
      <LessonViewDialog
        lesson={viewingLesson}
        open={!!viewingLesson}
        onOpenChange={(open) => !open && setViewingLesson(null)}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.confirm')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('lessons.deleteConfirm', 'Are you sure you want to delete this lesson?')}
              {lessonToDelete && (
                <span className="block mt-2 font-medium text-foreground">
                  "{lessonToDelete.title}"
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={deleteLesson.isPending}
            >
              {deleteLesson.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {t('common.delete', 'Delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentPage>
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
