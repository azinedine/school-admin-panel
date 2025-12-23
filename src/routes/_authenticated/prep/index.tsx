import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Settings } from 'lucide-react'
import { ContentPage } from '@/components/layout/content-page'
import { DailyPlannerTable } from '@/components/DailyPlannerTable'
import { TimetableEmptyState } from '@/components/TimetableEmptyState'
import { TimetableSetupDialog } from '@/components/TimetableSetupDialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { usePrepStore, type DailyPlanEntry } from '@/store/prep-store'

const DAYS: DailyPlanEntry['day'][] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']

function PrepPage() {
  const { t } = useTranslation()
  const { isTimetableInitialized, getAllTimetableSlots, initializeTimetable, setTimetable } = usePrepStore()
  const [selectedDay, setSelectedDay] = useState<DailyPlanEntry['day']>('sunday')
  const [timetableDialogOpen, setTimetableDialogOpen] = useState(false)

  // If no timetable, show empty state
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
          }}
        />
      </ContentPage>
    )
  }

  // Show full planner with timetable
  return (
    <ContentPage 
      title={t('pages.prep.title')} 
      description={t('pages.prep.description')}
      headerActions={
        <Button
          variant="outline"
          size="sm"
          onClick={() => setTimetableDialogOpen(true)}
        >
          <Settings className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          {t('pages.prep.timetable.edit')}
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Day Selector */}
        <Tabs value={selectedDay} onValueChange={(v) => setSelectedDay(v as DailyPlanEntry['day'])}>
          <TabsList className="grid w-full grid-cols-5">
            {DAYS.map((day) => (
              <TabsTrigger key={day} value={day} className="capitalize">
                {t(`pages.prep.days.${day}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Daily Planner Table */}
        <DailyPlannerTable selectedDay={selectedDay} />
      </div>

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
    </ContentPage>
  )
}

export const Route = createFileRoute('/_authenticated/prep/')({
  component: PrepPage,
})
