import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'
import { useTranslation } from 'react-i18next'
import { ContentPage } from '@/components/layout/content-page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LessonsTab, PreparationTab, TimetableTab } from './lessons_components'
import { BookOpen, FileText, Calendar } from 'lucide-react'

/**
 * Unified Lesson Management Page
 * 
 * Merges lessons library, preparation view, and timetable planning
 * into a single cohesive feature with tabs.
 * 
 * - Lessons Tab: CRUD operations for lesson library
 * - Preparation Tab: Read-only view of lesson preparations
 * - Timetable Tab: Term and schedule planning
 */
function LessonManagementPage() {
  const { t } = useTranslation()

  return (
    <ContentPage
      title={t('nav.lessonManagement', 'Lesson Management')}
      description={t('lessons.description', 'Manage your lessons, preparations, and schedule')}
    >
      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="lessons" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">{t('lessons.tabs.library', 'Library')}</span>
          </TabsTrigger>
          <TabsTrigger value="preparation" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">{t('lessons.tabs.preparation', 'Preparation')}</span>
          </TabsTrigger>
          <TabsTrigger value="timetable" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">{t('lessons.tabs.timetable', 'Timetable')}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6">
          <LessonsTab />
        </TabsContent>

        <TabsContent value="preparation" className="mt-6">
          <PreparationTab />
        </TabsContent>

        <TabsContent value="timetable" className="mt-6">
          <TimetableTab />
        </TabsContent>
      </Tabs>
    </ContentPage>
  )
}

export const Route = createFileRoute('/_authenticated/teacher/lessons/')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user?.role === 'parent') {
      throw redirect({
        to: '/unauthorized',
      })
    }
  },
  component: LessonManagementPage,
})
