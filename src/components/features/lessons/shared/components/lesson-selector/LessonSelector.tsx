import { useTranslation } from 'react-i18next'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import type { LessonTemplate } from '@/store/prep-store'
import { useLessonSelectorFilters } from './useLessonSelectorFilters'
import { SelectorYearTabs } from './SelectorYearTabs'
import { SelectorSearchBar } from './SelectorSearchBar'
import { SelectorEmptyState } from './SelectorEmptyState'
import { SelectorTemplateItem } from './SelectorTemplateItem'
import { SelectorFooter } from './SelectorFooter'

interface LessonSelectorProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSelect: (template: LessonTemplate) => void
    templates: LessonTemplate[]
    addedLessonNumbers?: string[]
    defaultYear?: '1st' | '2nd' | '3rd' | '4th'
    availableYears?: string[]
}

export function LessonSelector({
    open,
    onOpenChange,
    onSelect,
    templates,
    addedLessonNumbers = [],
    defaultYear = '1st',
    availableYears = ['1st', '2nd', '3rd', '4th'],
}: LessonSelectorProps) {
    const { t } = useTranslation()

    const filters = useLessonSelectorFilters({
        templates,
        defaultYear,
        availableYears,
        open,
    })

    const handleSelect = (template: LessonTemplate) => {
        onSelect(template)
        // Don't close the dialog - allow adding multiple lessons
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <DialogTitle>{t('pages.prep.selectFromLibrary')}</DialogTitle>
                </DialogHeader>

                <SelectorYearTabs
                    selectedYear={filters.selectedYear}
                    onYearChange={filters.setSelectedYear}
                    availableYears={availableYears}
                />

                <SelectorSearchBar
                    searchTerm={filters.searchTerm}
                    onSearchChange={filters.setSearchTerm}
                    selectedField={filters.selectedField}
                    onFieldChange={filters.setSelectedField}
                    fields={filters.fields}
                />

                <div className="flex-1 p-4 overflow-y-auto">
                    {filters.filteredTemplates.length === 0 ? (
                        <SelectorEmptyState />
                    ) : (
                        <div className="space-y-3">
                            {filters.filteredTemplates.map((template) => (
                                <SelectorTemplateItem
                                    key={template.id}
                                    template={template}
                                    isAdded={addedLessonNumbers.includes(template.lessonNumber)}
                                    onSelect={() => handleSelect(template)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <SelectorFooter count={filters.filteredTemplates.length} />
            </DialogContent>
        </Dialog>
    )
}
