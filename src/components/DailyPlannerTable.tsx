import { useState } from 'react'
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

const TIME_SLOTS: DailyPlanEntry['timeSlot'][] = [
  '08:00-09:00',
  '09:00-10:00',
  '10:00-11:00',
  '11:00-12:00',
]

const GROUPS: DailyPlanEntry['group'][] = ['first', 'second']

export function DailyPlannerTable({ selectedDay }: DailyPlannerTableProps) {
  const { t } = useTranslation()
  const { getPlanByDayAndSlot, addPlanEntry, updatePlanEntry, deletePlanEntry } = usePrepStore()
  
  const [dialogState, setDialogState] = useState<{
    open: boolean
    day: DailyPlanEntry['day']
    timeSlot: DailyPlanEntry['timeSlot']
    group: DailyPlanEntry['group']
    existingLesson?: DailyPlanEntry
  } | null>(null)

  const handleCellClick = (
    timeSlot: DailyPlanEntry['timeSlot'],
    group: DailyPlanEntry['group']
  ) => {
    const existing = getPlanByDayAndSlot(selectedDay, timeSlot, group)
    setDialogState({
      open: true,
      day: selectedDay,
      timeSlot,
      group,
      existingLesson: existing,
    })
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deletePlanEntry(id)
  }

  const renderCell = (timeSlot: DailyPlanEntry['timeSlot'], group: DailyPlanEntry['group']) => {
    const lesson = getPlanByDayAndSlot(selectedDay, timeSlot, group)

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
                  <DropdownMenuItem onClick={() => handleCellClick(timeSlot, group)}>
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

    return (
      <div className="min-h-[80px] p-2 flex items-center justify-center">
        <Button
          variant="ghost"
          size="sm"
          className="w-full h-full text-muted-foreground hover:text-foreground"
          onClick={() => handleCellClick(timeSlot, group)}
        >
          <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
          {t('pages.prep.emptySlot')}
        </Button>
      </div>
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
              {TIME_SLOTS.map((timeSlot) => (
                <TableRow key={timeSlot}>
                  <TableCell className="text-center font-semibold bg-muted/30">
                    {timeSlot}
                  </TableCell>
                  {GROUPS.map((group) => (
                    <TableCell
                      key={`${timeSlot}-${group}`}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
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
          existingLesson={dialogState.existingLesson}
          onSave={addPlanEntry}
          onUpdate={updatePlanEntry}
        />
      )}
    </>
  )
}
