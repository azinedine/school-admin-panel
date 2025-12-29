import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Eye, BookOpen, Loader2 } from 'lucide-react'

import { ContentPage } from '@/components/layout/content-page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useLessonPreps } from '@/hooks/use-lesson-preparation'
import { LessonPrepDetails } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonPrepDetails'
import { LessonPageNav } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonPageNav'

import type { LessonPreparation } from '@/schemas/lesson-preparation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ar, fr, enUS } from 'date-fns/locale'

export const Route = createFileRoute('/_authenticated/teacher/lessons/preparation')({
  component: PreparationPage,
})

function PreparationPage() {
  const { t, i18n } = useTranslation()
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedPrep, setSelectedPrep] = useState<LessonPreparation | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'ready' | 'delivered'>('all')

  const { data: allPreps = [], isLoading } = useLessonPreps()

  const locale = i18n.language === 'ar' ? ar : i18n.language === 'fr' ? fr : enUS

  // Filter preparations based on status
  const filteredPreps = allPreps.filter((prep) => {
    if (statusFilter === 'all') return true
    return prep.status === statusFilter
  })

  const handleView = (prep: LessonPreparation) => {
    setSelectedPrep(prep)
    setDetailsOpen(true)
  }

  const statusConfig = {
    draft: {
      label: t('lessons.status.draft', 'Draft'),
      className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    },
    ready: {
      label: t('lessons.status.ready', 'Ready'),
      className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    delivered: {
      label: t('lessons.status.delivered', 'Delivered'),
      className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    },
  }

  return (
    <ContentPage
      title={t('nav.lessonPreparation', 'Lesson Preparation')}
      description={t('pages.lessonPreparation.description', 'View your lesson preparations (read-only)')}
    >
      {/* Page Navigation */}
      <LessonPageNav />

      {/* Tabs for status filtering */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            {t('common.all', 'All')} ({allPreps.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            {t('lessons.status.draft', 'Draft')} ({allPreps.filter((p) => p.status === 'draft').length})
          </TabsTrigger>
          <TabsTrigger value="ready">
            {t('lessons.status.ready', 'Ready')} ({allPreps.filter((p) => p.status === 'ready').length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            {t('lessons.status.delivered', 'Delivered')} ({allPreps.filter((p) => p.status === 'delivered').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lesson Preparations Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredPreps.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              {t('lessons.noPreparations', 'No lesson preparations')}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {t('lessons.noPreparationsDesc', 'Create lesson preparations from the Add Lesson page')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPreps.map((prep) => {
            const status = statusConfig[prep.status as keyof typeof statusConfig]
            const formattedDate = format(new Date(prep.date), 'PPP', { locale })

            return (
              <Card key={prep.id} className="group transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate" title={prep.title}>
                        {prep.title}
                      </CardTitle>
                    </div>
                    <Badge className={cn('font-medium shrink-0', status?.className)}>
                      {status?.label || prep.status}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pb-4">
                  {/* Meta Information */}
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                    <div>
                      <span className="font-medium">{t('lessons.form.class', 'Class')}:</span>{' '}
                      {prep.class}
                    </div>
                    <div>
                      <span className="font-medium">{t('lessons.form.subject', 'Subject')}:</span>{' '}
                      {prep.subject}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">{t('lessons.form.date', 'Date')}:</span>{' '}
                      {formattedDate}
                    </div>
                  </div>

                  {/* View Button - Read Only */}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleView(prep)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('common.view', 'View Details')}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* View Details Dialog - Read Only */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('lessons.details', 'Lesson Preparation Details')}</DialogTitle>
          </DialogHeader>
          {selectedPrep && <LessonPrepDetails data={selectedPrep} />}
        </DialogContent>
      </Dialog>
    </ContentPage>
  )
}
