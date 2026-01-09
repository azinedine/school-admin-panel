import { Search, Users, TrendingUp, CheckCircle, XCircle, Star, UserPlus, UserX, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import type { GradeSheetStatistics } from "../types"
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface GradeSheetToolbarProps {
    statistics: GradeSheetStatistics
    searchQuery: string
    onSearchChange: (value: string) => void
    showGroups: boolean
    onToggleGroups: () => void
    showSpecialCasesOnly: boolean
    onToggleSpecialCases: () => void
    showAbsencesOnly: boolean
    onToggleAbsences: () => void
    showLatenessOnly: boolean
    onToggleLateness: () => void
    absenceFilterDate?: Date
    onAbsenceFilterDateChange?: (date: Date | undefined) => void
    canAddStudent: boolean
    onAddStudent: () => void
    t: (key: string) => string
}

export function GradeSheetToolbar({
    statistics,
    searchQuery,
    onSearchChange,
    showGroups,
    onToggleGroups,
    showSpecialCasesOnly,
    onToggleSpecialCases,
    showAbsencesOnly,
    onToggleAbsences,
    showLatenessOnly,
    onToggleLateness,
    absenceFilterDate,
    onAbsenceFilterDateChange,
    canAddStudent,
    onAddStudent,
    t,
}: GradeSheetToolbarProps) {
    return (
        <div className="flex flex-col gap-3 p-2 sm:p-4 rounded-lg border bg-muted/30">
            {/* Statistics - compact horizontal scroll on mobile */}
            <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-1 sm:pb-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.totalStudents')}</p>
                        <p className="text-sm sm:text-lg font-bold">{statistics.total}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-blue-500/10">
                        <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.classAverage')}</p>
                        <p className="text-sm sm:text-lg font-bold">{statistics.classAverage}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-green-500/10">
                        <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.successRate')}</p>
                        <p className="text-sm sm:text-lg font-bold text-green-600">{statistics.passRate}%</p>
                    </div>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    <div className="p-1.5 sm:p-2 rounded-lg bg-red-500/10">
                        <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
                    </div>
                    <div>
                        <p className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">{t('pages.grades.stats.failureRate')}</p>
                        <p className="text-sm sm:text-lg font-bold text-red-600">{statistics.failRate}%</p>
                    </div>
                </div>
            </div>

            {/* Search and Controls - compact on mobile */}
            <div className="flex items-center gap-1.5 sm:gap-2 w-full">
                <div className="flex-1 max-w-[200px] sm:max-w-none sm:flex-none sm:min-w-[280px]">
                    <div className="relative">
                        <Search className="absolute h-3.5 w-3.5 sm:h-4 sm:w-4 top-1/2 -translate-y-1/2 text-muted-foreground ltr:left-2.5 sm:ltr:left-3 rtl:right-2.5 sm:rtl:right-3" />
                        <Input
                            placeholder={t('pages.grades.search.placeholder')}
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="h-8 sm:h-10 text-sm ltr:pl-8 sm:ltr:pl-9 rtl:pr-8 sm:rtl:pr-9"
                        />
                    </div>
                </div>

                {/* Add Student Button */}
                {canAddStudent && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={onAddStudent}
                                    className="h-8 w-8"
                                    aria-label={t('pages.grades.addStudent.button')}
                                >
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>{t('pages.grades.addStudent.button')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                {/* Compact Controls */}
                <div className="flex items-center gap-1.5 shrink-0">
                    {/* Group Split Toggle */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={showGroups ? "default" : "outline"}
                                    size="icon"
                                    onClick={onToggleGroups}
                                    className="h-8 w-8"
                                    aria-label={showGroups ? t('pages.grades.groups.hideGroups') : t('pages.grades.groups.showGroups')}
                                >
                                    <Users className="h-4 w-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                <p>{showGroups ? t('pages.grades.groups.hideGroups') : t('pages.grades.groups.showGroups')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    {/* Special Cases Filter */}
                    {statistics.specialCaseCount > 0 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={showSpecialCasesOnly ? "default" : "outline"}
                                        size="icon"
                                        onClick={onToggleSpecialCases}
                                        className="h-8 w-8 relative"
                                        aria-label={t('pages.grades.specialCase.showOnly')}
                                    >
                                        <Star className="h-4 w-4" />
                                        {statistics.specialCaseCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-primary text-primary-foreground border-2 border-background">
                                                {statistics.specialCaseCount}
                                            </span>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>{t('pages.grades.specialCase.showOnly')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}

                    {/* Absences Filter */}
                    <div className="flex items-center gap-1">
                        {showAbsencesOnly && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-[140px] h-8 justify-start text-left font-normal",
                                            !absenceFilterDate && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {absenceFilterDate ? format(absenceFilterDate, "dd/MM/yyyy") : <span>{t('pages.grades.date.pick')}</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        mode="single"
                                        selected={absenceFilterDate}
                                        onSelect={onAbsenceFilterDateChange}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                        {statistics.absenceCount > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant={showAbsencesOnly ? "default" : "outline"}
                                            size="icon"
                                            onClick={onToggleAbsences}
                                            className="h-8 w-8 relative"
                                            aria-label={t('pages.grades.absences.showOnly')}
                                        >
                                            <UserX className="h-4 w-4" />
                                            {statistics.absenceCount > 0 && (
                                                <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-primary text-primary-foreground border-2 border-background">
                                                    {statistics.absenceCount}
                                                </span>
                                            )}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom">
                                        <p>{t('pages.grades.absences.showOnly')}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    {/* Lateness Filter */}
                    {statistics.latenessCount > 0 && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={showLatenessOnly ? "default" : "outline"}
                                        size="icon"
                                        onClick={onToggleLateness}
                                        className="h-8 w-8 relative"
                                        aria-label={t('pages.grades.lateness.showOnly')}
                                    >
                                        <Clock className="h-4 w-4" />
                                        {statistics.latenessCount > 0 && (
                                            <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-[10px] font-bold rounded-full bg-primary text-primary-foreground border-2 border-background">
                                                {statistics.latenessCount}
                                            </span>
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p>{t('pages.grades.lateness.showOnly')}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>
            </div>
        </div>
    )
}

export type { GradeSheetStatistics }
