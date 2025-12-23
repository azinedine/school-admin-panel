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
import { LessonDetailDialog } from './LessonDetailDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DailyPlannerTableProps {
  selectedDay: DailyPlanEntry['day']
}

const GROUPS: DailyPlanEntry['group'][] = ['first', 'second']

export function DailyPlannerTable({ selectedDay }: DailyPlannerTableProps) {
  const { t } = useTranslation()
  const { getTimetableByDay, getPlanByDayAndSlot, addPlanEntry, updatePlanEntry, deletePlanEntry } = usePrepStore()
  
  // Get timetable slots for selected day
  const timetableSlots = useMemo(() => {
    return getTimetableByDay(selectedDay)
  }, [selectedDay, getTimetableByDay])

  // Get unique time slots for this day
  const timeSlots = useMemo(() => {
    const slots = Array.from(new Set(timetableSlots.map(slot => slot.timeSlot)))
    return slots.sort() // Sort chronologically
  }, [timetableSlots])
  
  const [dialogState, setDialogState] = useState<{
    open: boolean
    day: string
    timeSlot: string
    group: string
    prefilledClass?: string
    existingLesson?: DailyPlanEntry
  } | null>(null)

  const handleCellClick = (
    timeSlot: string,
    group: string,
    prefilledClass?: string
  ) => {
    const existing = getPlanByDayAndSlot(selectedDay, timeSlot, group)
    setDialogState({
      open: true,
      day: selectedDay,
      timeSlot,
      group,
      prefilledClass,
      existingLesson: existing,
    })
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deletePlanEntry(id)
  }

  // Get timetable entry for specific slot and group
  const getTimetableSlot = (timeSlot: string, group: string) => {
    return timetableSlots.find(t => t.timeSlot === timeSlot && t.group === group)
  }

  const renderCell = (timeSlot: string, group: string) => {
    const timetableEntry = getTimetableSlot(timeSlot, group)
    const lesson = getPlanByDayAndSlot(selectedDay, timeSlot, group)

    // If no timetable entry for this slot/group combo, show empty
    if (!timetableEntry) {
      return (
        <div className="min-h-[80px] p-2 flex items-center justify-center">
          <span className="text-xs text-muted-foreground">-</span>
        </div>
      )
    }

    // If we have a lesson, show it
    if (lesson) {
      return (
        <div className="min-h-[80px] p-2 group relative">
          <div className="space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{lesson.class}</p>
                <p className="text-sm text-foreground truncate">{lesson.lessonTitle}</p>
                {lesson.lessonContent && (
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {lesson.lessonContent}
                  </p>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleCellClick(timeSlot, group, timetableEntry.class)}>
                    <Edit className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('common.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => handleDelete(lesson.id, e)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                    {t('common.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      )
    }

    // Show empty slot with timetable info (class from timetable)
    return (
      <div 
        className="min-h-[80px] p-2 flex flex-col justify-center cursor-pointer hover:bg-muted/50 transition-colors rounded"
        onClick={() => handleCellClick(timeSlot, group, timetableEntry.class)}
      >
        <div className="text-center space-y-1">
          <p className="text-xs font-semibold text-muted-foreground">{timetableEntry.class}</p>
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <Plus className="h-3 w-3 ltr:mr-1 rtl:ml-1" />
            <span className="text-xs">{t('pages.prep.emptySlot')}</span>
          </Button>
        </div>
      </div>
    )
  }

  // Show message if no timetable slots for this day
  if (timeSlots.length === 0) {
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
                <TableHead className="w-[150px] text-center font-bold">
                  {t('pages.prep.timeSlot')}
                </TableHead>
                {GROUPS.map((group) => (
                  <TableHead key={group} className="text-center font-bold min-w-[300px]">
                    {t(`pages.prep.groups.${group}`)}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {timeSlots.map((timeSlot) => (
                <TableRow key={timeSlot}>
                  <TableCell className="text-center font-semibold bg-muted/30">
                    {timeSlot}
                  </TableCell>
                  {GROUPS.map((group) => (
                    <TableCell
                      key={`${timeSlot}-${group}`}
                    >
                      {renderCell(timeSlot, group)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {dialogState && (
        <LessonDetailDialog
          open={dialogState.open}
          onOpenChange={(open) => {
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
