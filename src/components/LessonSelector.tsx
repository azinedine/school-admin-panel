import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Filter, BookOpen } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { LessonTemplate } from '@/store/prep-store'

interface LessonSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (template: LessonTemplate) => void
  templates: LessonTemplate[]
}

export function LessonSelector({
  open,
  onOpenChange,
  onSelect,
  templates,
}: LessonSelectorProps) {
  const { t } = useTranslation()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedField, setSelectedField] = useState<string>('all')

  // Get unique fields for filter
  const fields = useMemo(() => {
    const uniqueFields = new Set(templates.map((t) => t.field).filter(Boolean))
    return Array.from(uniqueFields).sort()
  }, [templates])

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch = template.lessonTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesField =
        selectedField === 'all' || template.field === selectedField

      return matchesSearch && matchesField
    })
  }, [templates, searchTerm, selectedField])

  const handleSelect = (template: LessonTemplate) => {
    onSelect(template)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>{t('pages.prep.selectFromLibrary')}</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4 bg-muted/30 border-b">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:right-2.5 rtl:left-auto" />
              <Input
                placeholder={t('pages.prep.searchLessons')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 rtl:pr-9 rtl:pl-3 bg-background"
              />
            </div>
            <Select value={selectedField} onValueChange={setSelectedField}>
              <SelectTrigger className="w-[180px] bg-background">
                <Filter className="w-4 h-4 mr-2 rtl:ml-2 text-muted-foreground" />
                <SelectValue placeholder={t('pages.prep.filterBySubject')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('pages.prep.allSubjects')}</SelectItem>
                {fields.map((field) => (
                  <SelectItem key={field} value={field}>
                    {field}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {filteredTemplates.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground text-center">
              <BookOpen className="h-12 w-12 mb-4 opacity-20" />
              <p>{t('pages.prep.noLessonsFound')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer group"
                  onClick={() => handleSelect(template)}
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {template.lessonTitle}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {t(`pages.addLesson.years.${template.academicYear}`)}
                      </Badge>
                      {template.field && (
                        <>
                          <span>•</span>
                          <span>{template.field}</span>
                        </>
                      )}
                    </div>
                    {template.learningSegment && (
                      <p className="text-xs text-muted-foreground pt-1 line-clamp-1">
                        {template.learningSegment}
                      </p>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    {t('pages.prep.select')}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t bg-muted/10 text-xs text-center text-muted-foreground">
          {filteredTemplates.length} {t('pages.addLesson.lessonsCount', { count: filteredTemplates.length })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
