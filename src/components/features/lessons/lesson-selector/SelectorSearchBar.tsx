import { useTranslation } from 'react-i18next'
import { Search, Filter } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface SelectorSearchBarProps {
    searchTerm: string
    onSearchChange: (value: string) => void
    selectedField: string
    onFieldChange: (value: string) => void
    fields: string[]
}

export function SelectorSearchBar({
    searchTerm,
    onSearchChange,
    selectedField,
    onFieldChange,
    fields,
}: SelectorSearchBarProps) {
    const { t } = useTranslation()

    return (
        <div className="p-4 space-y-4 bg-muted/30 border-b">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground rtl:right-2.5 rtl:left-auto" />
                    <Input
                        placeholder={t('pages.prep.searchLessons')}
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 rtl:pr-9 rtl:pl-3 bg-background"
                    />
                </div>
                <Select value={selectedField} onValueChange={onFieldChange}>
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
    )
}
