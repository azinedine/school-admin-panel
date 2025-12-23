import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { LessonTemplate } from '@/store/prep-store'
import { LessonTemplateCard } from '@/components/LessonTemplateCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

interface LessonLibraryProps {
  lessons: LessonTemplate[]
  onEdit: (lesson: LessonTemplate) => void
  onDelete: (id: string) => void
  onDuplicate: (lesson: LessonTemplate) => void
}

const ACADEMIC_YEARS: Array<LessonTemplate['academicYear']> = ['1st', '2nd', '3rd', '4th']

export function LessonLibrary({
  lessons,
  onEdit,
  onDelete,
  onDuplicate,
}: LessonLibraryProps) {
  const { t } = useTranslation()
  const [selectedYear, setSelectedYear] = useState<LessonTemplate['academicYear'] | 'all'>('all')

  // Group lessons by academic year for tab counts
  const lessonsByYear = ACADEMIC_YEARS.reduce((acc, year) => {
    acc[year] = lessons.filter((lesson) => lesson.academicYear === year)
    return acc
  }, {} as Record<LessonTemplate['academicYear'], LessonTemplate[]>)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {t('pages.addLesson.lessonLibrary')}
        </h2>
        <span className="text-sm text-muted-foreground">
          {t('pages.addLesson.lessonsCount', { count: lessons.length })}
        </span>
      </div>

      {/* Year Filter Tabs */}
      <Tabs value={selectedYear} onValueChange={(value) => setSelectedYear(value as typeof selectedYear)}>
        <TabsList className="w-full grid grid-cols-5">
          <TabsTrigger value="all">
            {t('pages.addLesson.allYears')}
          </TabsTrigger>
          {ACADEMIC_YEARS.map((year) => (
            <TabsTrigger key={year} value={year}>
              {t(`pages.addLesson.years.${year}`)}
              {lessonsByYear[year].length > 0 && (
                <span className="ltr:ml-1 rtl:mr-1 text-xs bg-primary/20 px-1.5 rounded">
                  {lessonsByYear[year].length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* All Years Tab */}
        <TabsContent value="all" className="mt-4">
          {lessons.length === 0 ? (
            <EmptyState message={t('pages.addLesson.createFirstLesson')} />
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {lessons.map((lesson) => (
                <LessonTemplateCard
                  key={lesson.id}
                  lesson={lesson}
                  onEdit={() => onEdit(lesson)}
                  onDelete={() => onDelete(lesson.id)}
                  onDuplicate={() => onDuplicate(lesson)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Individual Year Tabs */}
        {ACADEMIC_YEARS.map((year) => (
          <TabsContent key={year} value={year} className="mt-4">
            {lessonsByYear[year].length === 0 ? (
              <EmptyState message={t('pages.addLesson.noLessonsForYear')} />
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {lessonsByYear[year].map((lesson) => (
                  <LessonTemplateCard
                    key={lesson.id}
                    lesson={lesson}
                    onEdit={() => onEdit(lesson)}
                    onDelete={() => onDelete(lesson.id)}
                    onDuplicate={() => onDuplicate(lesson)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <Card className="p-8">
      <div className="text-center text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>{message}</p>
      </div>
    </Card>
  )
}
