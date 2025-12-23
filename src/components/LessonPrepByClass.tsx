import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Trash2, Plus } from 'lucide-react'
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
  const formatDate = (date?: string) => {
    if (!date) return t('pages.prep.noDate')
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
                  <TableHead className="w-[100px] text-center">
                    {t('common.actions')}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classLessons.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      <div className="space-y-4">
                        <p>{t('pages.prep.table.noLessons')}</p>
                    
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  classLessons.map((lesson) => (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium">
                        {formatDate(lesson.date)}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {lesson.timeSlot}
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
                      <TableCell className="text-center">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(lesson.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
    </>
  )
}
