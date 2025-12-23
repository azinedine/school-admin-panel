import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2, X, BookOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type DailyPlanEntry, usePrepStore, type LessonTemplate } from '@/store/prep-store'
import { LessonSelector } from './LessonSelector'

import { Checkbox } from '@/components/ui/checkbox'

interface LessonDetailDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (lesson: Omit<DailyPlanEntry, 'id'>) => void
  onUpdate?: (id: string, updates: Partial<DailyPlanEntry>) => void
  day: string
  timeSlot: string
  group: string
  prefilledClass?: string
  existingLesson?: DailyPlanEntry
  initialTemplate?: LessonTemplate | null
  enableScheduling?: boolean
}

export function LessonDetailDialog({
  open,
  onOpenChange,
  onSave,
  onUpdate,
  day,
  timeSlot,
  group,
  prefilledClass,
  existingLesson,
  initialTemplate,
  enableScheduling = false,
}: LessonDetailDialogProps) {
  const { t } = useTranslation()
  const getAllLessonTemplates = usePrepStore((state) => state.getAllLessonTemplates)
  
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<LessonTemplate | null>(initialTemplate || null)
  
  // Multi-group state
  const [activeGroups, setActiveGroups] = useState<('first' | 'second')[]>(['first'])
  const [groupTimes, setGroupTimes] = useState({
    first: { start: '08:00', end: '09:00' },
    second: { start: '09:00', end: '10:00' }
  })

  const [formData, setFormData] = useState({
    class: '',
    lessonTitle: '',
    lessonContent: '',
    practiceNotes: '',
    date: '',
    startTime: '08:00',
    endTime: '09:00',
    mode: 'fullClass' as 'fullClass' | 'groups',
    group: 'first' as 'first' | 'second',
    status: undefined as 'completed' | 'postponed' | 'deleted' | undefined,
    statusNote: '',
    field: '',
    learningSegment: '',
    knowledgeResource: '',
    lessonElements: [] as string[],
    assessment: '',
  })

  // Get all templates and optionally filter by academic year
  const allTemplates = getAllLessonTemplates()
  const availableTemplates = allTemplates // Could be filtered by academic year based on class name

  // Load existing lesson data or prefilled class when dialog opens
  useEffect(() => {
    if (existingLesson) {
      // Split timeSlot "08:00-09:00" if needed, but usually it's passed as prop
      const [start, end] = existingLesson.timeSlot.split('-')
      
      setFormData({
        class: existingLesson.class,
        lessonTitle: existingLesson.lessonTitle,
        lessonContent: existingLesson.lessonContent,
        practiceNotes: existingLesson.practiceNotes,
        date: existingLesson.date || '',
        startTime: start || existingLesson.timeSlot, // Fallback
        endTime: end || '',
        mode: existingLesson.mode,
        group: existingLesson.group || 'first',
        status: existingLesson.status,
        statusNote: existingLesson.statusNote || '',
        field: existingLesson.field || '',
        learningSegment: existingLesson.learningSegment || '',
        knowledgeResource: existingLesson.knowledgeResource || '',
        lessonElements: existingLesson.lessonElements || [],
        assessment: existingLesson.assessment || '',
      })
      setSelectedTemplate(null)
      // Reset multi-group state (edit mode is single group)
      setActiveGroups([existingLesson.group || 'first'])
    } else if (initialTemplate) {
       // Populate from initial template
       setFormData({
        class: prefilledClass || '',
        lessonTitle: initialTemplate.lessonTitle,
        lessonContent: initialTemplate.lessonContent,
        practiceNotes: initialTemplate.practiceNotes,
        date: new Date().toISOString().split('T')[0], // Default to today for scheduling
        startTime: '08:00',
        endTime: '09:00',
        mode: 'fullClass',
        group: 'first',
        status: undefined,
        statusNote: '',
        field: initialTemplate.field,
        learningSegment: initialTemplate.learningSegment,
        knowledgeResource: initialTemplate.knowledgeResource,
        lessonElements: [...initialTemplate.lessonElements],
        assessment: initialTemplate.assessment,
      })
      setSelectedTemplate(initialTemplate)
      // Default groups
      setActiveGroups(['first'])
    } else {
      // Reset form for new lesson, use prefilled class if available
      setFormData({
        class: prefilledClass || '',
        lessonTitle: '',
        lessonContent: '',
        practiceNotes: '',
        date: '',
        startTime: '08:00',
        endTime: '09:00',
        mode: 'fullClass',
        group: 'first',
        status: undefined,
        statusNote: '',
        field: '',
        learningSegment: '',
        knowledgeResource: '',
        lessonElements: [],
        assessment: '',
      })
      setSelectedTemplate(null)
      setActiveGroups(['first'])
    }
  }, [existingLesson, prefilledClass, open, initialTemplate])

  // Handle template selection
  const handleTemplateSelect = (template: LessonTemplate) => {
    setSelectedTemplate(template)
    setFormData((prev) => ({
      ...prev,
      lessonTitle: template.lessonTitle,
      field: template.field,
      learningSegment: template.learningSegment,
      knowledgeResource: template.knowledgeResource,
      lessonElements: [...template.lessonElements],
      assessment: template.assessment,
      lessonContent: template.lessonContent,
      practiceNotes: template.practiceNotes,
    }))
  }

  // Clear template selection
  const handleClearTemplate = () => {
    setSelectedTemplate(null)
    setFormData((prev) => ({
      ...prev,
      lessonTitle: '',
      field: '',
      learningSegment: '',
      knowledgeResource: '',
      lessonElements: [],
      assessment: '',
      lessonContent: '',
      practiceNotes: '',
    }))
  }

  const handleSave = () => {
    if (!formData.class.trim() || !formData.lessonTitle.trim() || !formData.date.trim()) {
      return // Basic validation
    }
    
    // Construct timeSlot
    // If not scheduling, use the prop 'timeSlot'
    // If scheduling, use 'startTime-endTime' OR just 'startTime' if end is empty?
    // Let's assume timeSlot prop takes precedence if enableScheduling is false
    
    let finalTimeSlot = timeSlot
    let finalGroup = group as DailyPlanEntry['group']
    let finalMode = 'groups' as DailyPlanEntry['mode']

    if (enableScheduling) {
       finalTimeSlot = `${formData.startTime}-${formData.endTime}`
       finalMode = formData.mode
       finalGroup = formData.mode === 'groups' ? formData.group : undefined
    }

    if (existingLesson && onUpdate) {
      // Update existing lesson (Single Entry)
      onUpdate(existingLesson.id, {
        ...formData,
        timeSlot: enableScheduling ? finalTimeSlot : undefined, 
        mode: enableScheduling ? finalMode : undefined,
        group: enableScheduling ? finalGroup : undefined,
      })
    } else {
      // Create new lesson(s)
      if (enableScheduling && formData.mode === 'groups') {
        // Multi-group creation logic
        activeGroups.forEach(g => {
             const groupTime = groupTimes[g]
             const entryTimeSlot = `${groupTime.start}-${groupTime.end}`
             
             onSave({
                day: day as DailyPlanEntry['day'],
                timeSlot: entryTimeSlot,
                ...formData,
                // Override with specific group details
                mode: 'groups',
                group: g,
             })
        })
      } else {
         // Single entry creation (Full Class or fallback)
          onSave({
            day: day as DailyPlanEntry['day'],
            timeSlot: finalTimeSlot,
            ...formData,
            // Ensure explicit values take precedence
            mode: finalMode,
            group: finalGroup,
          })
      }
    }

    onOpenChange(false)
  }

  const toggleGroup = (g: 'first' | 'second') => {
    setActiveGroups(prev => 
      prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]
    )
  }

  // Update time for a specific group
  const updateGroupTime = (g: 'first' | 'second', type: 'start' | 'end', value: string) => {
    setGroupTimes(prev => ({
        ...prev,
        [g]: { ...prev[g], [type]: value }
    }))
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {existingLesson ? t('pages.prep.editLesson') : t('pages.prep.addLesson')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Template Selection */}
          {availableTemplates.length > 0 && !existingLesson && (
            <div className="space-y-4 pb-6 border-b">
              <h3 className="text-sm font-semibold text-foreground">
                {t('pages.prep.templateSection')}
              </h3>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                   {selectedTemplate ? (
                    <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{selectedTemplate.lessonTitle}</span>
                        <span className="text-xs text-muted-foreground">{selectedTemplate.field}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearTemplate}
                        className="h-8 w-8 p-0"
                      >
                         <X className="h-4 w-4" />
                      </Button>
                    </div>
                   ) : (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full justify-start text-muted-foreground"
                      onClick={() => setSelectorOpen(true)}
                    >
                      <BookOpen className="w-4 h-4 mr-2 rtl:ml-2" />
                      {t('pages.prep.selectFromLibrary')}
                    </Button>
                   )}
                </div>
              </div>
            </div>
          )}

          <LessonSelector
            open={selectorOpen}
            onOpenChange={setSelectorOpen}
            onSelect={handleTemplateSelect}
            templates={availableTemplates}
          />

          {/* Section 1: Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              {t('pages.prep.sections.basicInfo')}
            </h3>
            
            <div className="grid gap-2">
              <Label htmlFor="class">{t('pages.prep.class')}</Label>
              <Input
                id="class"
                value={formData.class}
                readOnly
                disabled
                className="bg-muted cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                {t('pages.prep.classFromTimetable')}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">{t('pages.prep.date')} *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            {enableScheduling && (
              <>
                 <div className="grid gap-2">
                  <Label htmlFor="mode">{t('pages.prep.mode')}</Label>
                  <Select
                    value={formData.mode}
                    onValueChange={(value) => setFormData({ ...formData, mode: value as any })}
                  >
                    <SelectTrigger id="mode">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fullClass">{t('pages.prep.fullClass')}</SelectItem>
                      <SelectItem value="groups">{t('pages.prep.groups.title')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Full Class Time */}
                {formData.mode === 'fullClass' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="startTime">{t('pages.prep.startTime')} *</Label>
                      <Input
                        id="startTime"
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="endTime">{t('pages.prep.endTime')} *</Label>
                      <Input
                        id="endTime"
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                
                {/* Multi-Group Time Selection (Only for New Lessons) */}
                {formData.mode === 'groups' && !existingLesson && (
                   <div className="space-y-4 pt-2 border rounded-md p-4">
                      <Label>{t('pages.prep.groups.title')}</Label>
                      
                      {/* Group 1 */}
                      <div className="flex items-end gap-4">
                         <div className="flex items-center space-x-2 pb-2.5">
                            <Checkbox 
                              id="group1" 
                              checked={activeGroups.includes('first')}
                              onCheckedChange={() => toggleGroup('first')}
                            />
                            <Label htmlFor="group1" className="cursor-pointer font-normal">
                              {t('pages.prep.group1')}
                            </Label>
                         </div>
                         {activeGroups.includes('first') && (
                           <div className="flex gap-2 flex-1">
                              <div className="grid gap-1 flex-1">
                                <Label className="text-xs text-muted-foreground">{t('pages.prep.startTime')}</Label>
                                <Input 
                                  type="time" 
                                  className="h-8" 
                                  value={groupTimes.first.start}
                                  onChange={(e) => updateGroupTime('first', 'start', e.target.value)}
                                />
                              </div>
                              <div className="grid gap-1 flex-1">
                                <Label className="text-xs text-muted-foreground">{t('pages.prep.endTime')}</Label>
                                <Input 
                                  type="time" 
                                  className="h-8"
                                  value={groupTimes.first.end}
                                  onChange={(e) => updateGroupTime('first', 'end', e.target.value)}
                                />
                              </div>
                           </div>
                         )}
                      </div>

                      {/* Group 2 */}
                      <div className="flex items-end gap-4">
                         <div className="flex items-center space-x-2 pb-2.5">
                            <Checkbox 
                              id="group2" 
                              checked={activeGroups.includes('second')}
                              onCheckedChange={() => toggleGroup('second')}
                            />
                            <Label htmlFor="group2" className="cursor-pointer font-normal">
                              {t('pages.prep.group2')}
                            </Label>
                         </div>
                         {activeGroups.includes('second') && (
                           <div className="flex gap-2 flex-1">
                              <div className="grid gap-1 flex-1">
                                <Label className="text-xs text-muted-foreground">{t('pages.prep.startTime')}</Label>
                                <Input 
                                  type="time" 
                                  className="h-8" 
                                  value={groupTimes.second.start}
                                  onChange={(e) => updateGroupTime('second', 'start', e.target.value)}
                                />
                              </div>
                              <div className="grid gap-1 flex-1">
                                <Label className="text-xs text-muted-foreground">{t('pages.prep.endTime')}</Label>
                                <Input 
                                  type="time" 
                                  className="h-8"
                                  value={groupTimes.second.end}
                                  onChange={(e) => updateGroupTime('second', 'end', e.target.value)}
                                />
                              </div>
                           </div>
                         )}
                      </div>
                      
                      {activeGroups.length === 0 && (
                        <p className="text-xs text-destructive">
                           {t('pages.prep.selectAtLeastOneGroup')}
                        </p>
                      )}
                   </div>
                )}
                
                {/* Legacy Single Group Select (For Edit Mode) */}
                 {formData.mode === 'groups' && existingLesson && (
                  <div className="grid gap-2">
                    <Label htmlFor="group">{t('pages.prep.selectGroup')}</Label>
                    <Select
                      value={formData.group}
                      onValueChange={(value) => setFormData({ ...formData, group: value as any })}
                    >
                      <SelectTrigger id="group">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="first">{t('pages.prep.group1')}</SelectItem>
                        <SelectItem value="second">{t('pages.prep.group2')}</SelectItem>
                      </SelectContent>
                    </Select>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="startTime">{t('pages.prep.startTime')} *</Label>
                          <Input
                            id="startTime"
                            type="time"
                            value={formData.startTime}
                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="endTime">{t('pages.prep.endTime')} *</Label>
                          <Input
                            id="endTime"
                            type="time"
                            value={formData.endTime}
                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                  </div>
                )}
              </>
            )}

            <div className="grid gap-2">
              <Label htmlFor="lessonTitle">{t('pages.prep.lessonTitle')} *</Label>
              <Input
                id="lessonTitle"
                value={formData.lessonTitle}
                onChange={(e) => setFormData({ ...formData, lessonTitle: e.target.value })}
                placeholder={t('pages.prep.lessonTitle')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">{t('pages.prep.status.label')}</Label>
              <Select
                value={formData.status || 'none'}
                onValueChange={(value) => setFormData({ 
                  ...formData, 
                  status: value === 'none' ? undefined : value as 'completed' | 'postponed' | 'deleted',
                  statusNote: value === 'none' ? '' : formData.statusNote
                })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('pages.prep.status.none')}</SelectItem>
                  <SelectItem value="completed">{t('pages.prep.status.completed')}</SelectItem>
                  <SelectItem value="postponed">{t('pages.prep.status.postponed')}</SelectItem>
                  <SelectItem value="deleted">{t('pages.prep.status.deleted')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(formData.status === 'postponed' || formData.status === 'deleted') && (
              <div className="grid gap-2">
                <Label htmlFor="statusNote">
                  {formData.status === 'postponed' ? t('pages.prep.status.postponedReason') : t('pages.prep.status.deletedReason')}
                </Label>
                <Textarea
                  id="statusNote"
                  value={formData.statusNote}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, statusNote: e.target.value })}
                  placeholder={formData.status === 'postponed' ? t('pages.prep.status.postponedPlaceholder') : t('pages.prep.status.deletedPlaceholder')}
                  rows={2}
                />
              </div>
            )}
          </div>

          {/* Section 2: Lesson Structure */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              {t('pages.prep.sections.structure')}
            </h3>

            <div className="grid gap-2">
              <Label htmlFor="field">{t('pages.prep.lessonStructure.field')}</Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                placeholder={t('pages.prep.lessonStructure.fieldPlaceholder')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="learningSegment">{t('pages.prep.lessonStructure.learningSegment')}</Label>
              <Input
                id="learningSegment"
                value={formData.learningSegment}
                onChange={(e) => setFormData({ ...formData, learningSegment: e.target.value })}
                placeholder={t('pages.prep.lessonStructure.learningSegmentPlaceholder')}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="knowledgeResource">{t('pages.prep.lessonStructure.knowledgeResource')}</Label>
              <Input
                id="knowledgeResource"
                value={formData.knowledgeResource}
                onChange={(e) => setFormData({ ...formData, knowledgeResource: e.target.value })}
                placeholder={t('pages.prep.lessonStructure.knowledgeResourcePlaceholder')}
              />
            </div>
          </div>

          {/* Section 3: Lesson Elements */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              {t('pages.prep.sections.elements')}
            </h3>

            {formData.lessonElements.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                {t('pages.prep.lessonElements.noElements')}
              </p>
            ) : (
              <div className="space-y-2">
                {formData.lessonElements.map((element, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t('pages.prep.lessonElements.elementNumber', { number: index + 1 })}
                        </span>
                      </div>
                      <Input
                        value={element}
                        onChange={(e) => {
                          const newElements = [...formData.lessonElements]
                          newElements[index] = e.target.value
                          setFormData({ ...formData, lessonElements: newElements })
                        }}
                        placeholder={t('pages.prep.lessonElements.elementPlaceholder')}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newElements = formData.lessonElements.filter((_, i) => i !== index)
                        setFormData({ ...formData, lessonElements: newElements })
                      }}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setFormData({
                  ...formData,
                  lessonElements: [...formData.lessonElements, '']
                })
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
              {t('pages.prep.lessonElements.addElement')}
            </Button>
          </div>

          {/* Section 4: Content & Evaluation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground border-b pb-2">
              {t('pages.prep.sections.contentEvaluation')}
            </h3>

            <div className="grid gap-2">
              <Label htmlFor="lessonContent">{t('pages.prep.lessonContent')}</Label>
              <Textarea
                id="lessonContent"
                value={formData.lessonContent}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, lessonContent: e.target.value })}
                placeholder={t('pages.prep.lessonContent')}
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assessment">{t('pages.prep.assessment')}</Label>
              <Textarea
                id="assessment"
                value={formData.assessment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, assessment: e.target.value })}
                placeholder={t('pages.prep.assessmentPlaceholder')}
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="practiceNotes">{t('pages.prep.practiceNotes')}</Label>
              <Textarea
                id="practiceNotes"
                value={formData.practiceNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, practiceNotes: e.target.value })}
                placeholder={t('pages.prep.practiceNotes')}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!formData.class.trim() || !formData.lessonTitle.trim() || !formData.date.trim()}
          >
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
