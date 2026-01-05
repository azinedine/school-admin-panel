import { useTranslation } from 'react-i18next'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface SelectorYearTabsProps {
    selectedYear: string
    onYearChange: (year: string) => void
    availableYears: string[]
}

export function SelectorYearTabs({
    selectedYear,
    onYearChange,
    availableYears,
}: SelectorYearTabsProps) {
    const { t } = useTranslation()

    return (
        <div className="border-b px-4 bg-muted/10">
            <Tabs value={selectedYear} onValueChange={onYearChange} className="w-full">
                <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0 h-auto">
                    {availableYears.map((year) => (
                        <TabsTrigger
                            key={year}
                            value={year}
                            className="rounded-none border-b-2 border-transparent px-4 py-2 font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground transition-colors"
                        >
                            {t(`pages.addLesson.years.${year}`)}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>
        </div>
    )
}
