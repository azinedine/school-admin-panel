import type { GradeClass } from '../types'

interface ClassSelectorProps {
    classes: GradeClass[]
    selectedClassId: string | null
    onClassSelect: (classId: string) => void
    getClassStudentCount: (classId: string) => number
    t: (key: string) => string
}

export function ClassSelector({
    classes,
    selectedClassId,
    onClassSelect,
    getClassStudentCount,
}: ClassSelectorProps) {
    return (
        <div className="mb-4">
            <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                {classes.map((cls) => {
                    const isActive = cls.id === selectedClassId
                    const studentCount = getClassStudentCount(cls.id)
                    const hasValidLevel = cls.grade_level && ['1AP', '2AP', '3AP', '4AP', '5AP'].includes(cls.grade_level)

                    return (
                        <button
                            key={cls.id}
                            onClick={() => onClassSelect(cls.id)}
                            className={`
                flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg
                text-xs sm:text-sm font-medium transition-all whitespace-nowrap
                ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
                                }
              `}
                        >
                            <span className="font-medium">{cls.name}</span>

                            {/* Student count badge */}
                            <span className={`
                inline-flex items-center justify-center min-w-[1.25rem] h-4 px-1 text-[10px] font-bold rounded-full
                ${isActive ? 'bg-white/20' : 'bg-muted'}
              `}>
                                {studentCount}
                            </span>

                            {/* Level indicator - only show warning on mobile */}
                            {!hasValidLevel && (
                                <span className="text-[10px] text-amber-500 font-bold">!</span>
                            )}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
