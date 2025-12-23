import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type TimetableEntry } from '@/store/prep-store'
import { useGradesStore } from '@/store/grades-store'
import { Card } from '@/components/ui/card'

interface TimetableSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (entries: Omit<TimetableEntry, 'id'>[]) => void
  existingTimetable?: TimetableEntry[]
}

interface TimetableSlot {
  tempId: string
  day: TimetableEntry['day']
  startTime: string
  endTime: string
  class: string
  mode: 'fullClass' | 'groups'
  group?: 'first' | 'second'  // Optional
}

const DAYS: TimetableEntry['day'][] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday']
const GROUPS: ('first' | 'second')[] = ['first', 'second']

export function TimetableSetupDialog({
  open,
  onOpenChange,
  onSave,
  existingTimetable,
}: TimetableSetupDialogProps) {
  const { t } = useTranslation()
  const classes = useGradesStore((state) => state.classes)

  // Initialize slots from existing timetable or empty
  const [slots, setSlots] = useState<TimetableSlot[]>(() => {
    if (existingTimetable && existingTimetable.length > 0) {
      return existingTimetable.map((entry) => {
        const [startTime, endTime] = entry.timeSlot.split('-')
        return {
          tempId: crypto.randomUUID(),
          day: entry.day,
          startTime: startTime.trim(),
          endTime: endTime.trim(),
          class: entry.class,
          mode: entry.mode || 'groups',  // Default to 'groups' for backward compatibility
          group: entry.group || 'first',
        }
      })
    }
    // Default: one empty slot in groups mode
    return [
      {
        tempId: crypto.randomUUID(),
        day: 'sunday',
        startTime: '08:00',
        endTime: '09:00',
        class: '',
        mode: 'groups',
        group: 'first',
      },
    ]
  })

  const addSlot = () => {
    setSlots([
      ...slots,
      {
        tempId: crypto.randomUUID(),
        day: 'sunday',
        startTime: '08:00',
        endTime: '09:00',
        class: '',
        mode: 'groups',
        group: 'first',
      },
    ])
  }

  const removeSlot = (tempId: string) => {
    setSlots(slots.filter((s) => s.tempId !== tempId))
  }

  const updateSlot = (tempId: string, field: keyof TimetableSlot, value: string) => {
    setSlots(
      slots.map((s) =>
        s.tempId === tempId ? { ...s, [field]: value } : s
      )
    )
  }

  const handleSave = () => {
    // Validation
    const hasEmptyClass = slots.some((s) => !s.class.trim())
    if (hasEmptyClass) {
      return // Could show toast error
    }

    // Validate that group mode slots have a group selected
    const hasInvalidGroupSlot = slots.some((s) => s.mode === 'groups' && !s.group)
    if (hasInvalidGroupSlot) {
      return // Could show toast error
    }

    if (slots.length === 0) {
      return // Could show toast error
    }

    // Convert to timetable entries
    const timetableEntries: Omit<TimetableEntry, 'id'>[] = slots.map((slot) => ({
      day: slot.day,
      timeSlot: `${slot.startTime}-${slot.endTime}`,
      class: slot.class.trim(),
      mode: slot.mode,
      ...(slot.mode === 'groups' && slot.group ? { group: slot.group } : {}),
    }))

    onSave(timetableEntries)
    onOpenChange(false)
  }

  // Check if no classes available
  const hasNoClasses = classes.length === 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('pages.prep.timetable.title')}
          </DialogTitle>
          <DialogDescription>
            {t('pages.prep.timetable.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Slots List */}
          <div className="space-y-3">
            {slots.map((slot, index) => (
              <Card key={slot.tempId} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold">
                      {t('pages.prep.timetable.form.slot')} {index + 1}
                    </Label>
                    {slots.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSlot(slot.tempId)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Day */}
                    <div className="space-y-1.5">
                      <Label htmlFor={`day-${slot.tempId}`} className="text-xs">
                        {t('pages.prep.timetable.form.day')}
                      </Label>
                      <Select
                        value={slot.day}
                        onValueChange={(v) => updateSlot(slot.tempId, 'day', v)}
                      >
                        <SelectTrigger id={`day-${slot.tempId}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((day) => (
                            <SelectItem key={day} value={day}>
                              {t(`pages.prep.days.${day}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Start Time */}
                    <div className="space-y-1.5">
                      <Label htmlFor={`start-${slot.tempId}`} className="text-xs">
                        {t('pages.prep.timetable.form.startTime')}
                      </Label>
                      <Input
                        id={`start-${slot.tempId}`}
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => updateSlot(slot.tempId, 'startTime', e.target.value)}
                      />
                    </div>

                    {/* End Time */}
                    <div className="space-y-1.5">
                      <Label htmlFor={`end-${slot.tempId}`} className="text-xs">
                        {t('pages.prep.timetable.form.endTime')}
                      </Label>
                      <Input
                        id={`end-${slot.tempId}`}
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => updateSlot(slot.tempId, 'endTime', e.target.value)}
                      />
                    </div>

                    {/* Group */}
                    <div className="space-y-1.5">
                      <Label htmlFor={`group-${slot.tempId}`} className="text-xs">
                        {t('pages.prep.timetable.form.group')}
                      </Label>
                      <Select
                        value={slot.group || ''}
                        onValueChange={(v) => updateSlot(slot.tempId, 'group', v)}
                      >
                        <SelectTrigger id={`group-${slot.tempId}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {GROUPS.map((group) => (
                            <SelectItem key={group} value={group}>
                              {t(`pages.prep.groups.${group}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Class - Full width */}
                  <div className="space-y-1.5">
                    <Label htmlFor={`class-${slot.tempId}`} className="text-xs">
                      {t('pages.prep.timetable.form.class')} *
                    </Label>
                    {classes.length > 0 ? (
                      <Select
                        value={slot.class}
                        onValueChange={(v) => updateSlot(slot.tempId, 'class', v)}
                      >
                        <SelectTrigger id={`class-${slot.tempId}`}>
                          <SelectValue placeholder={t('pages.prep.timetable.form.selectClass')} />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls.id} value={cls.name}>
                              {cls.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {t('pages.prep.timetable.form.noClassesAvailable')}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Add Slot Button */}
          <Button 
            variant="outline" 
            onClick={addSlot} 
            className="w-full"
            disabled={hasNoClasses}
          >
            <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
            {t('pages.prep.timetable.form.addTimeSlot')}
          </Button>

          {hasNoClasses && (
            <p className="text-sm text-destructive text-center">
              {t('pages.prep.timetable.form.createClassesFirst')}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={hasNoClasses || slots.length === 0 || slots.some((s) => !s.class.trim())}
          >
            {t('pages.prep.timetable.form.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
