import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { ContentPage } from '@/components/layout/content-page'
import { DailyPlannerTable } from '@/components/DailyPlannerTable'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type DailyPlanEntry } from '@/store/prep-store'

const DAYS: DailyPlanEntry['day'][] = ['sunday', 'monday', 'wednesday', 'thursday']

function PrepPage() {
  const { t } = useTranslation()
  const [selectedDay, setSelectedDay] = useState<DailyPlanEntry['day']>('sunday')

  return (
    <ContentPage 
      title={t('pages.prep.title')} 
      description={t('pages.prep.description')}
    >
      <div className="space-y-6">
        {/* Day Selector */}
        <Tabs value={selectedDay} onValueChange={(v) => setSelectedDay(v as DailyPlanEntry['day'])}>
          <TabsList className="grid w-full grid-cols-4">
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
    </ContentPage>
  )
}

export const Route = createFileRoute('/_authenticated/prep/')({
  component: PrepPage,
})
