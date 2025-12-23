import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, Plus, Edit2, Check, X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePrepStore, type DailyPlanEntry, type LessonTemplate } from '@/store/prep-store'
import { useGradesStore } from '@/store/grades-store'

import { LessonSelector } from './LessonSelector'


export function LessonPrepByClass() {
  const { t } = useTranslation()
  const { 
    planEntries,
    addPlanEntry, 
    deletePlanEntry,
    updatePlanEntry,
    getAllLessonTemplates,
  } = usePrepStore()
  
  // Get all classes from grades system
  const { classes: gradesClasses } = useGradesStore()
  
  // Get all unique class names from grades
  const classes = useMemo(() => {
    return gradesClasses.map(c => c.name).sort()
  }, [gradesClasses])

  const [selectedClass, setSelectedClass] = useState<string>(classes[0] || '')
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editTimeSlot, setEditTimeSlot] = useState('')
  const [statusNoteOpen, setStatusNoteOpen] = useState(false)
  const [selectedStatusLesson, setSelectedStatusLesson] = useState<DailyPlanEntry | null>(null)
  const [statusNote, setStatusNote] = useState('')
  const [pendingStatus, setPendingStatus] = useState<DailyPlanEntry['status'] | null>(null)
  


  // Get lessons for selected class
  const classLessons = useMemo(() => {
    return planEntries
      .filter(lesson => lesson.class === selectedClass)
      .sort((a, b) => {
        // Sort by date first
        if (a.date && b.date) {
          const dateCompare = a.date.localeCompare(b.date)
          if (dateCompare !== 0) return dateCompare
        }
        // Then by time slot
        if (a.timeSlot < b.timeSlot) return -1
        if (a.timeSlot > b.timeSlot) return 1
        return 0
      })
  }, [planEntries, selectedClass])

  // Get list of already-added lesson titles for the selected class
  const addedLessonTitles = useMemo(() => {
    return planEntries
      .filter(entry => entry.class === selectedClass)
      .map(entry => entry.lessonTitle)
  }, [planEntries, selectedClass])



  const handleAddLesson = () => {
    setSelectorOpen(true)
  }

  const handleTemplateSelected = (template: LessonTemplate) => {
    // Add lesson directly without opening dialog
    const lessonData = {
      day: 'monday' as DailyPlanEntry['day'], // Default
      timeSlot: '08:00-09:00', // Default
      class: selectedClass,
      lessonTitle: template.lessonTitle,
      lessonContent: template.lessonContent,
      practiceNotes: template.practiceNotes,
      date: new Date().toISOString().split('T')[0], // Today's date
      field: template.field,
      learningSegment: template.learningSegment,
      knowledgeResource: template.knowledgeResource,
      lessonElements: [...template.lessonElements],
      assessment: template.assessment,
      mode: 'fullClass' as DailyPlanEntry['mode'],
      group: undefined,
      status: undefined,
      statusNote: '',
    }

    // Check for duplicates
    const isDuplicate = planEntries.some(entry => 
      entry.class === lessonData.class && 
      entry.lessonTitle === lessonData.lessonTitle
    )

    if (isDuplicate) {
      import('sonner').then(({ toast }) => {
        toast.error(t('pages.prep.lessonAlreadyAssigned'))
      })
      return
    }

    // Add the lesson
    addPlanEntry(lessonData)

    // Show success toast
    import('sonner').then(({ toast }) => {
      toast.success(t('pages.prep.addLesson'), {
        description: template.lessonTitle,
      })
    })
  }

  const handleDelete = (id: string) => {
    deletePlanEntry(id)
  }

  // Format date for display
  // Format date for display (handles YYYY-MM-DD as local date)
  const formatDate = (date?: string) => {
    if (!date) return t('pages.prep.noDate')
    
    // Check if YYYY-MM-DD
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const parts = date.split('-')
      const year = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const day = parseInt(parts[2], 10)
      const localDate = new Date(year, month, day)
      
      return localDate.toLocaleDateString(undefined, { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    }
    
    // Fallback for other formats
    return new Date(date).toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (classes.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-muted-foreground">
          <p>{t('pages.prep.timetable.noSlotsForDay')}</p>
        </div>
      </Card>
    )
  }

  const handleEdit = (lesson: DailyPlanEntry) => {
    setEditingId(lesson.id)
    
    // Ensure date is in YYYY-MM-DD format for the date input
    let formattedDate = lesson.date || ''
    if (formattedDate && !formattedDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // If date is not in YYYY-MM-DD format, try to parse and format it
      const dateObj = new Date(formattedDate)
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0]
      }
    }
    
    setEditDate(formattedDate)
    setEditTimeSlot(lesson.timeSlot || '')
  }

  const handleSaveEdit = (lessonId: string) => {
    console.log('Attemping to save edit:', { lessonId, editDate, editTimeSlot })
    
    // Validate that we have values to save
    if (!editDate.trim() || !editTimeSlot.trim()) {
      import('sonner').then(({ toast }) => {
        toast.error('Please fill in both date and time')
      })
      return
    }

    const updates = {
      date: editDate.trim(),
      timeSlot: editTimeSlot.trim(),
    }
    
    console.log('Sending updates to store:', updates)
    updatePlanEntry(lessonId, updates)
    
    // Reset edit state
    setEditingId(null)
    setEditDate('')
    setEditTimeSlot('')
    
    // Show success toast
    import('sonner').then(({ toast }) => {
      toast.success(t('common.updateSuccess'))
    })
  }

  const handleStatusChange = (lesson: DailyPlanEntry, newStatus: string) => {
    const status = newStatus as DailyPlanEntry['status']
    
    // If status requires a note (custom or postponed), open dialog
    if (status === 'custom' || status === 'postponed') {
      setSelectedStatusLesson(lesson)
      setPendingStatus(status)
      setStatusNote(lesson.statusNote || '')
      setStatusNoteOpen(true)
      return
    }

    // Otherwise update directly
    updatePlanEntry(lesson.id, { 
      status,
      statusNote: undefined 
    })
  }

  const handleSaveStatusNote = () => {
    if (selectedStatusLesson && pendingStatus) {
      updatePlanEntry(selectedStatusLesson.id, {
        status: pendingStatus,
        statusNote: statusNote
      })
      setStatusNoteOpen(false)
      setSelectedStatusLesson(null)
      setPendingStatus(null)
      setStatusNote('')
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditDate('')
    setEditTimeSlot('')
  }

  return (
    <>
      <div className="space-y-6">
        {/* Class Selector at Top */}
        <Tabs value={selectedClass} onValueChange={setSelectedClass}>
          <TabsList className="w-full justify-start">
            {classes.map((className) => (
              <TabsTrigger key={className} value={className}>
                {className}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Lessons Table for Selected Class */}
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
                  <TableHead className="w-[140px]">
                    {t('pages.prep.status.label')}
                  </TableHead>
                  <TableHead className="w-[100px] text-center">
                    {t('common.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classLessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      <div className="space-y-4">
                        <p>{t('pages.prep.table.noLessons')}</p>
                    
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  classLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        {editingId === lesson.id ? (
                          <Input
                            type="date"
                            value={editDate}
                            onChange={(e) => setEditDate(e.target.value)}
                            className="w-[150px]"
                          />
                        ) : (
                          formatDate(lesson.date)
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {editingId === lesson.id ? (
                          <Input
                            type="text"
                            value={editTimeSlot}
                            onChange={(e) => setEditTimeSlot(e.target.value)}
                            placeholder="08:00-09:00"
                            className="w-[120px]"
                          />
                        ) : (
                          lesson.timeSlot
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{lesson.lessonTitle}</p>
                            {lesson.status && (
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                lesson.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                lesson.status === 'postponed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                              }`}>
                                {t(`pages.prep.status.${lesson.status}`)}
                              </span>
                            )}
                          </div>
                          {lesson.statusNote && (
                            <p className="text-xs text-muted-foreground italic">
                              {lesson.statusNote}
                            </p>
                          )}
                          {lesson.group && lesson.mode === 'groups' && (
                            <p className="text-xs text-muted-foreground">
                              {t(`pages.prep.groups.${lesson.group}`)}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={lesson.status || 'none'}
                          onValueChange={(value) => handleStatusChange(lesson, value)}
                        >
                          <SelectTrigger className={`h-8 w-full ${
                            lesson.status === 'completed' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800' :
                            lesson.status === 'postponed' ? 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800' :
                            lesson.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800' :
                            lesson.status === 'custom' ? 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800' :
                            ''
                          }`}>
                            <SelectValue placeholder={t('pages.prep.status.none')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t('pages.prep.status.none')}</SelectItem>
                            <SelectItem value="completed">{t('pages.prep.status.completed')}</SelectItem>
                            <SelectItem value="postponed">{t('pages.prep.status.postponed')}</SelectItem>
                            <SelectItem value="cancelled">{t('pages.prep.status.cancelled')}</SelectItem>
                            <SelectItem value="custom">{t('pages.prep.status.custom')}</SelectItem>
                          </SelectContent>
                        </Select>
                        {lesson.statusNote && (
                          <p className="text-xs text-muted-foreground mt-1 truncate max-w-[120px]" title={lesson.statusNote}>
                            {lesson.statusNote}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {editingId === lesson.id ? (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleSaveEdit(lesson.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={handleCancelEdit}
                                className="text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEdit(lesson)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDelete(lesson.id)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t flex justify-center">
            <Button onClick={handleAddLesson} variant="outline" size="sm">
              <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('pages.prep.addLesson')}
            </Button>
          </div>
        </Card>
      </div>

      <LessonSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelect={handleTemplateSelected}
        templates={getAllLessonTemplates()}
        addedLessonTitles={addedLessonTitles}
      />

      <Dialog open={statusNoteOpen} onOpenChange={setStatusNoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingStatus === 'postponed' 
                ? t('pages.prep.status.postponedReason') 
                : t('pages.prep.status.addNote')}
            </DialogTitle>
            <DialogDescription>
              {pendingStatus === 'postponed'
                ? t('pages.prep.status.postponedPlaceholder')
                : t('common.addNote')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              placeholder={t('common.typeHere')}
              className="resize-none"
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusNoteOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveStatusNote}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
