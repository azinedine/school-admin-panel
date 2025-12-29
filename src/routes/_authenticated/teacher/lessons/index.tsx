import { useState } from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'
import { useTranslation } from 'react-i18next'
import { Settings, Calendar } from 'lucide-react'
import { ContentPage } from '@/components/layout/content-page'
import { TimetableEmptyState } from '@/components/TimetableEmptyState'
import { TimetableSetupDialog } from '@/components/TimetableSetupDialog'
import { TermSetupDialog } from '@/components/TermSetupDialog'
import { LessonPrepByClass } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonPrepByClass'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePrepStore } from '@/store/prep-store'

function PrepPage() {
  const { t } = useTranslation()
  const {
    isTimetableInitialized,
    getAllTimetableSlots,
    initializeTimetable,
    setTimetable,
    getTermDates,
    setTermDates,
  } = usePrepStore()
  const [timetableDialogOpen, setTimetableDialogOpen] = useState(false)
  const [termDialogOpen, setTermDialogOpen] = useState(false)

  const termDates = getTermDates()
  const hasTermDates = termDates.startDate && termDates.endDate

  // Step 1: If no timetable, show timetable setup
  if (!isTimetableInitialized) {
    return (
      <ContentPage
        title={t('pages.prep.title')}
        description={t('pages.prep.description')}
      >
        <TimetableEmptyState onSetupClick={() => setTimetableDialogOpen(true)} />

        <TimetableSetupDialog
          open={timetableDialogOpen}
          onOpenChange={setTimetableDialogOpen}
          onSave={(entries) => {
            initializeTimetable(entries)
            // After timetable is set, prompt for term dates
            setTermDialogOpen(true)
          }}
        />

        <TermSetupDialog
          open={termDialogOpen}
          onOpenChange={setTermDialogOpen}
          onSave={(startDate, endDate) => {
            setTermDates(startDate, endDate)
          }}
        />
      </ContentPage>
    )
  }

  // Step 2: If timetable exists but no term dates, show term setup
  if (!hasTermDates) {
    return (
      <ContentPage
        title={t('pages.prep.title')}
        description={t('pages.prep.description')}
      >
        <Card className="p-8">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Calendar className="h-16 w-16 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">
                {t('pages.prep.termSetup.title')}
              </h2>
              <p className="text-muted-foreground">
                {t('pages.prep.termSetup.description')}
              </p>
            </div>
            <Button onClick={() => setTermDialogOpen(true)} size="lg">
              <Calendar className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
              {t('pages.prep.termSetup.title')}
            </Button>
          </div>
        </Card>

        <TermSetupDialog
          open={termDialogOpen}
          onOpenChange={setTermDialogOpen}
          onSave={(startDate, endDate) => {
            setTermDates(startDate, endDate)
          }}
        />
      </ContentPage>
    )
  }

  // Step 3: Show lesson prep organized by class
  return (
    <ContentPage
      title={t('pages.prep.title')}
      description={t('pages.prep.description')}
      headerActions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTermDialogOpen(true)}
          >
            <Calendar className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('pages.prep.termSetup.title')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTimetableDialogOpen(true)}
          >
            <Settings className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('pages.prep.timetable.edit')}
          </Button>
        </div>
      }
    >
      {/* Lessons Organized by Class */}
      <LessonPrepByClass />

      {/* Edit Timetable Dialog */}
      <TimetableSetupDialog
        open={timetableDialogOpen}
        onOpenChange={setTimetableDialogOpen}
        existingTimetable={getAllTimetableSlots()}
        onSave={(entries) => {
          setTimetable(entries)
          setTimetableDialogOpen(false)
        }}
      />

      {/* Edit Term Dates Dialog */}
      <TermSetupDialog
        open={termDialogOpen}
        onOpenChange={setTermDialogOpen}
        existingStartDate={termDates.startDate || undefined}
        existingEndDate={termDates.endDate || undefined}
        onSave={(startDate, endDate) => {
          setTermDates(startDate, endDate)
        }}
      />
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
  component: PrepPage,
})
