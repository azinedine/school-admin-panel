import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2 } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { usePrepStore, type DailyPlanEntry } from '@/store/prep-store'
<<<<<<< HEAD
import { LessonDetailDialog } from '@/components/features/lessons'
=======
import { LessonDetailDialog } from '@/components/features/lessons/viewer/dialogs/lesson-detail-dialog'
>>>>>>> production
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DailyPlannerTableProps {
  selectedDay: DailyPlanEntry['day']
}

export function DailyPlannerTable({ selectedDay }: DailyPlannerTableProps) {
  const { t } = useTranslation()
  const {
    getTimetableByDay,
    getPlanByDay,
    addPlanEntry,
    updatePlanEntry,
    deletePlanEntry,
  } = usePrepStore()

  // Get timetable slots for selected day
  const timetableSlots = useMemo(() => {
    return getTimetableByDay(selectedDay)
  }, [selectedDay, getTimetableByDay])

  // Get all lessons for this day
  const dayLessons = useMemo(() => {
    return getPlanByDay(selectedDay).sort((a, b) => {
      // Sort by time slot first
      if (a.timeSlot < b.timeSlot) return -1
      if (a.timeSlot > b.timeSlot) return 1
      // Then by date if available
      if (a.date && b.date) {
        return a.date.localeCompare(b.date)
      }
      return 0
    })
  }, [selectedDay, getPlanByDay])

  const [dialogState, setDialogState] = useState<{
    open: boolean
    day: string
    timeSlot: string
    group: string
    prefilledClass?: string
    existingLesson?: DailyPlanEntry
  } | null>(null)

  const handleAddLesson = () => {
    // For adding, use first available timetable slot
    const firstSlot = timetableSlots[0]
    if (firstSlot) {
      setDialogState({
        open: true,
        day: selectedDay,
        timeSlot: firstSlot.timeSlot,
        group: firstSlot.group || 'first',
        prefilledClass: firstSlot.class,
        existingLesson: undefined,
      })
    }
  }

  const handleEditLesson = (lesson: DailyPlanEntry) => {
    setDialogState({
      open: true,
      day: lesson.day,
      timeSlot: lesson.timeSlot,
      group: lesson.group || 'first',
      prefilledClass: lesson.class,
      existingLesson: lesson,
    })
  }

  const handleDelete = (id: string) => {
    deletePlanEntry(id)
  }

  // Format date for display
  const formatDate = (date?: string) => {
    if (!date) return t('pages.prep.noDate')
    return new Date(date).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  // Show message if no timetable slots for this day
  if (timetableSlots.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <p>{t('pages.prep.timetable.noSlotsForDay')}</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">
                  {t('pages.prep.table.date')}
                </TableHead>
                <TableHead className="w-[150px]">
                  {t('pages.prep.table.time')}
                </TableHead>
                <TableHead>
                  {t('pages.prep.table.lessonTopic')}
                </TableHead>
                <TableHead className="w-[100px] text-center">
                  {t('common.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dayLessons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    <div className="space-y-4">
                      <p>{t('pages.prep.table.noLessons')}</p>
                      <Button onClick={handleAddLesson} variant="outline" size="sm">
                        <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                        {t('pages.prep.table.addFirstLesson')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                dayLessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">
                      {formatDate(lesson.date)}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {lesson.timeSlot}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="font-semibold">{lesson.lessonNumber}</p>
                        {lesson.class && (
                          <p className="text-xs text-muted-foreground">
                            {lesson.class}
                            {lesson.group && lesson.mode === 'groups' &&
                              ` • ${t(`pages.prep.groups.${lesson.group}`)}`
                            }
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditLesson(lesson)}>
                            <Edit className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(lesson.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {dayLessons.length > 0 && (
          <div className="p-4 border-t">
            <Button onClick={handleAddLesson} variant="outline" size="sm">
              <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('pages.prep.table.addLesson')}
            </Button>
          </div>
        )}
      </Card>


      {dialogState && (
        <LessonDetailDialog
          open={dialogState.open}
          onOpenChange={(open: boolean) => {
            if (!open) setDialogState(null)
          }}
          day={dialogState.day}
          timeSlot={dialogState.timeSlot}
          group={dialogState.group}
          prefilledClass={dialogState.prefilledClass}
          existingLesson={dialogState.existingLesson}
          onSave={addPlanEntry}
          onUpdate={updatePlanEntry}
        />
      )}
    </>
  )
}
