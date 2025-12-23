import { useTranslation } from 'react-i18next'
import { Calendar, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface TimetableEmptyStateProps {
  onSetupClick: () => void
}

export function TimetableEmptyState({ onSetupClick }: TimetableEmptyStateProps) {
  const { t } = useTranslation()

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md p-8">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <Calendar className="h-16 w-16 text-muted-foreground" />
              <BookOpen className="h-8 w-8 text-primary absolute -bottom-1 -right-1" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">
              {t('pages.prep.timetable.emptyState.title')}
            </h2>
            <p className="text-muted-foreground">
              {t('pages.prep.timetable.emptyState.description')}
            </p>
          </div>

          {/* Action */}
          <Button onClick={onSetupClick} size="lg" className="w-full">
            <Calendar className="h-5 w-5 ltr:mr-2 rtl:ml-2" />
            {t('pages.prep.timetable.emptyState.action')}
          </Button>
        </div>
      </Card>
    </div>
  )
}
