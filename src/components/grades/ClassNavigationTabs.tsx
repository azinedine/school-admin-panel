import { Badge } from "@/components/ui/badge"
import type { GradeClass } from "@/features/grades"
import { VALID_LEVELS } from "./utils/grade-calculations"

interface ClassNavigationTabsProps {
    classes: GradeClass[]
    selectedClassId: string | null
    onClassSelect: (classId: string) => void
    getClassStudentCount: (classId: string) => number
}

export function ClassNavigationTabs({
    classes,
    selectedClassId,
    onClassSelect,
    getClassStudentCount,
}: ClassNavigationTabsProps) {
    return (
        <div className="flex-shrink-0 mb-6 relative">
            {/* Gradient scroll indicators */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10" />

            {/* Scrollable class tabs - modern style */}
            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {classes.map((cls) => {
                    const isActive = cls.id === selectedClassId
                    const studentCount = getClassStudentCount(cls.id)
                    const hasValidLevel = cls.grade_level && VALID_LEVELS.includes(cls.grade_level as typeof VALID_LEVELS[number])

                    return (
                        <button
                            key={cls.id}
                            onClick={() => onClassSelect(cls.id)}
                            className={`
                group relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium
                whitespace-nowrap transition-all duration-200 ease-out cursor-pointer select-none
                ${isActive
                                    ? 'bg-gradient-to-r from-primary/90 to-primary text-primary-foreground'
                                    : 'bg-muted/40 hover:bg-muted/70 text-muted-foreground hover:text-foreground'
                                }
              `}
                        >
                            <span className="font-semibold">{cls.name}</span>

                            {/* Student count badge */}
                            <span className={`
                inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1.5 text-xs font-bold rounded-full
                ${isActive
                                    ? 'bg-white/20 text-primary-foreground'
                                    : 'bg-background/60 text-muted-foreground group-hover:bg-background/80'
                                }
              `}>
                                {studentCount}
                            </span>

                            {/* Level badge */}
                            {isActive ? (
                                hasValidLevel ? (
                                    <Badge className="bg-white/20 text-primary-foreground border-0 text-xs font-semibold hover:bg-white/30">
                                        {cls.grade_level}
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-xs font-semibold bg-amber-500/20 text-amber-100 border-amber-400/50 animate-pulse">
                                        !
                                    </Badge>
                                )
                            ) : (
                                hasValidLevel ? (
                                    <span className="text-xs text-muted-foreground/60">{cls.grade_level}</span>
                                ) : (
                                    <span className="text-xs text-amber-500 font-bold">!</span>
                                )
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
