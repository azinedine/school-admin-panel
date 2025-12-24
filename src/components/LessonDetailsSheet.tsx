
import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { DailyPlanEntry } from '@/store/prep-store'
import { useTranslation } from 'react-i18next'
import { Clock, BookOpen, List, CheckCircle2, Save } from 'lucide-react'

interface LessonDetailsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lesson: DailyPlanEntry | null
  editMode?: boolean
  onSave?: (id: string, updates: Partial<DailyPlanEntry>) => void
}

export function LessonDetailsSheet({
  open,
  onOpenChange,
  lesson,
  editMode = false,
  onSave,
}: LessonDetailsSheetProps) {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  // Form State
  const [date, setDate] = useState('')
  const [timeSlot, setTimeSlot] = useState('')
  const [practicalWork, setPracticalWork] = useState(false)
  const [homework, setHomework] = useState(false)

  // Initialize state when lesson changes
  useEffect(() => {
    if (lesson) {
      setDate(lesson.date || '')
      setTimeSlot(lesson.timeSlot || '')
      setPracticalWork(lesson.practicalWork || false)
      setHomework(lesson.homework || false)
    }
  }, [lesson])

  const handleSave = () => {
    if (lesson && onSave) {
      onSave(lesson.id, {
        date,
        timeSlot,
        practicalWork,
        homework,
      })
      onOpenChange(false)
    }
  }

  if (!lesson) return null

  // Format date for display (Read-only view)
  const formattedDate = lesson.date
    ? new Date(lesson.date).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : t('pages.prep.noDate')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={isRTL ? 'left' : 'right'}
        className="w-[400px] sm:w-[540px] p-0 flex flex-col"
      >
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            <SheetHeader className="space-y-4">
              <SheetTitle className="text-2xl font-bold text-primary">
                {editMode ? t('pages.prep.details.edit') : t('pages.prep.details.title')}
              </SheetTitle>
              {!editMode && (
                <SheetDescription className="flex flex-col gap-2 text-base">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="font-medium">{formattedDate}</span>
                    <span className="text-muted-foreground">•</span>
                    <span>{lesson.timeSlot}</span>
                  </div>
                </SheetDescription>
              )}
            </SheetHeader>

            <Separator />

            {/* Execution Details (Editable in Edit Mode) */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                {t('pages.prep.details.executionDetails')}
              </h3>

              {editMode ? (
                <div className="space-y-4 pl-6 rtl:pr-6 rtl:pl-0">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('pages.prep.table.date')}</Label>
                      <Input 
                        type="date" 
                        value={date} 
                        onChange={(e) => setDate(e.target.value)} 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('pages.prep.table.time')}</Label>
                      <Input 
                        value={timeSlot} 
                        onChange={(e) => setTimeSlot(e.target.value)}
                        placeholder="08:00-09:00" 
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-4 pt-2">
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <Label>{t('pages.prep.details.practicalWork')}</Label>
                      </div>
                      <Switch 
                        checked={practicalWork} 
                        onCheckedChange={setPracticalWork} 
                      />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <Label>{t('pages.prep.details.homework')}</Label>
                      </div>
                      <Switch 
                        checked={homework} 
                        onCheckedChange={setHomework} 
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // Read Only Execution View
                <div className="space-y-3 pl-6 rtl:pr-6 rtl:pl-0">
                   <div className="flex gap-4">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${
                      lesson.practicalWork 
                        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800' 
                        : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${lesson.practicalWork ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="font-medium">{t('pages.prep.details.practicalWork')}</span>
                      <span>{lesson.practicalWork ? t('pages.prep.details.yes') : t('pages.prep.details.no')}</span>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${
                      lesson.homework 
                        ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800' 
                        : 'bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-800/50 dark:text-gray-400 dark:border-gray-700'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${lesson.homework ? 'bg-blue-500' : 'bg-gray-300'}`} />
                      <span className="font-medium">{t('pages.prep.details.homework')}</span>
                      <span>{lesson.homework ? t('pages.prep.details.yes') : t('pages.prep.details.no')}</span>
                    </div>
                  </div>
                   {lesson.mode === 'groups' && (
                      <div className="flex items-center gap-2 text-sm mt-2">
                        <Badge variant={lesson.group === 'first' ? 'default' : 'outline'}>
                          {t('pages.prep.details.group1')}
                        </Badge>
                        <span className="text-muted-foreground">
                          {lesson.group === 'first' 
                            ? lesson.timeSlot 
                            : t('pages.prep.details.group2') + ' (' + t('pages.prep.table.time') + ')'}
                        </span>
                      </div>
                    )}
                </div>
              )}
            </div>

            <Separator />

            {/* Core Content (Always Read Only) */}
            <div className={`space-y-4 ${editMode ? 'opacity-80' : ''}`}>
               <h3 className="font-semibold flex items-center gap-2 text-primary">
                <BookOpen className="h-4 w-4" />
                {t('pages.prep.details.coreContent')}
              </h3>

              <div className="space-y-4">
                 <h4 className="font-medium pl-6 rtl:pr-6 rtl:pl-0">{lesson.lessonTitle}</h4>
                 
                 <div className="grid gap-4 pl-6 rtl:pr-6 rtl:pl-0 text-sm">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">
                      {t('pages.prep.details.field')}
                    </span>
                    <span className="col-span-2">{lesson.field || '-'}</span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">
                      {t('pages.prep.details.learningSegment')}
                    </span>
                    <span className="col-span-2">{lesson.learningSegment || '-'}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-muted-foreground font-medium">
                      {t('pages.prep.details.knowledgeResource')}
                    </span>
                    <span className="col-span-2">{lesson.knowledgeResource || '-'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Lesson Elements */}
            <div className={`space-y-3 ${editMode ? 'opacity-80' : ''}`}>
              <h3 className="font-semibold flex items-center gap-2">
                <List className="h-4 w-4" />
                {t('pages.prep.details.lessonElements')}
              </h3>
              {lesson.lessonElements && lesson.lessonElements.length > 0 ? (
                <ol className="list-decimal list-inside space-y-1 pl-6 rtl:pr-6 rtl:pl-0 text-sm">
                  {lesson.lessonElements.map((element, index) => (
                    <li key={index} className="leading-relaxed">
                      {element}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted-foreground pl-6 rtl:pr-6 rtl:pl-0">
                  -
                </p>
              )}
            </div>
            
             <Separator />

             {/* Assessment Description (Read only) */}
             <div className={`space-y-4 ${editMode ? 'opacity-80' : ''}`}>
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {t('pages.prep.details.assessment')}
              </h3>
              <p className="text-sm pl-6 rtl:pr-6 rtl:pl-0">{lesson.assessment || '-'}</p>
            </div>

          </div>
        </div>

        {/* Footer with Save Button - Only in Edit Mode */}
        {editMode && (
          <div className="p-4 border-t mt-auto bg-background">
            <Button className="w-full gap-2" onClick={handleSave}>
              <Save className="h-4 w-4" />
              {t('pages.prep.details.saveChanges')}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
