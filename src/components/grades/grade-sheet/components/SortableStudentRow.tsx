import { CSS } from "@dnd-kit/utilities"
import { useSortable } from "@dnd-kit/sortable"
import { GripVertical, Star, MoreVertical, Move, UserX, Info } from "lucide-react"
import {
    TableCell,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import type { CalculatedStudentGrade, StudentGrade } from "../types"
import { getRowColor } from "../utils"
import { EditableCell, AttendanceCell } from "./TableCells"

interface SortableStudentRowProps {
    student: CalculatedStudentGrade
    index: number
    studentNumber: number
    groupNumber: number
    showGroups: boolean
    editingCell: { id: string; field: string } | null
    setEditingCell: (cell: { id: string; field: string } | null) => void
    handleCellEdit: (id: string, field: keyof StudentGrade, value: string, keepOpen?: boolean) => void
    updateStudent: (id: string, updates: Partial<StudentGrade>) => void
    onMoveStudent: (student: CalculatedStudentGrade) => void
    onRemoveStudent: (student: CalculatedStudentGrade) => void
    onViewStudentInfo: (student: CalculatedStudentGrade) => void
    onOpenAttendanceDialog: (student: CalculatedStudentGrade, type: 'absence' | 'tardiness') => void
    onOpenHistoryDialog: (student: CalculatedStudentGrade) => void
    t: (key: string, opts?: Record<string, unknown>) => string
    isReadOnly?: boolean
}

export function SortableStudentRow({
    student,
    index,
    studentNumber,
    groupNumber,
    showGroups,
    editingCell,
    setEditingCell,
    handleCellEdit,
    updateStudent,
    onMoveStudent,
    onRemoveStudent,
    onViewStudentInfo,
    onOpenAttendanceDialog,
    onOpenHistoryDialog,
    t,
    isReadOnly = false,
}: SortableStudentRowProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: student.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    // Check if student has special case
    const hasSpecialCase = !!student.specialCase

    return (
        <TableRow
            ref={setNodeRef}
            style={style}
            className={`
        ${!hasSpecialCase ? getRowColor(student.finalAverage) : ''} 
        ${index % 2 === 0 ? 'bg-opacity-50' : ''}
        ${student.specialCase === 'autism'
                    ? 'border-s-4 border-s-blue-500 dark:border-s-blue-400 bg-blue-50/40 dark:bg-blue-950/30 hover:bg-blue-100/50 dark:hover:bg-blue-950/40'
                    : student.specialCase === 'diabetes'
                        ? 'border-s-4 border-s-orange-500 dark:border-s-orange-400 bg-orange-50/40 dark:bg-orange-950/30 hover:bg-orange-100/50 dark:hover:bg-orange-950/40'
                        : hasSpecialCase
                            ? 'border-s-4 border-s-purple-500 dark:border-s-purple-400 bg-purple-50/40 dark:bg-purple-950/30 hover:bg-purple-100/50 dark:hover:bg-purple-950/40'
                            : ''}
      `}
        >
            <TableCell className="cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                <GripVertical className="h-4 w-4 text-muted-foreground" />
            </TableCell>
            <TableCell className="text-center font-semibold">{studentNumber}</TableCell>
            {showGroups && (
                <TableCell className={`text-center font-bold ${groupNumber === 1 ? 'text-blue-600 bg-blue-50 dark:bg-blue-950' : 'text-green-600 bg-green-50 dark:bg-green-950'}`}>
                    {t('pages.grades.groups.groupLabel', { number: groupNumber })}
                </TableCell>
            )}
            {/* Student Management Menu Column */}
            <TableCell className="text-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button
                            className="inline-flex items-center justify-center p-1 rounded hover:bg-muted opacity-60 hover:opacity-100 transition-opacity"
                        >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuItem onClick={() => onViewStudentInfo(student)}>
                            <Info className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                            {t('pages.grades.studentManagement.viewInfo')}
                        </DropdownMenuItem>
                        {!isReadOnly && (
                            <>
                                <DropdownMenuItem onClick={() => onMoveStudent(student)}>
                                    <Move className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                    {t('pages.grades.studentManagement.moveToClass')}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onRemoveStudent(student)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    <UserX className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                                    {t('pages.grades.studentManagement.removeFromClass')}
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </TableCell>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <TableCell className="font-mono text-xs max-w-[60px] truncate cursor-help">{student.id.slice(0, 8)}...</TableCell>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p className="font-mono text-xs">{student.id}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <TableCell className="font-semibold whitespace-nowrap truncate max-w-[120px]">{student.lastName}</TableCell>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                        <p>{student.lastName}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <TableCell className="whitespace-nowrap max-w-[140px]">
                <span className="flex items-center gap-1">
                    <span className="truncate">{student.firstName}</span>
                    {/* Special Case Menu */}
                    <DropdownMenu>
                        <TooltipProvider delayDuration={300}>
                            <Tooltip>
                                <DropdownMenuTrigger asChild>
                                    <TooltipTrigger asChild>
                                        <button
                                            className={`shrink-0 p-0.5 rounded hover:bg-muted ${hasSpecialCase ? '' : 'opacity-40 hover:opacity-100'}`}
                                        >
                                            <Star className={`h-3 w-3 ${student.specialCase === 'longAbsence'
                                                ? 'text-red-500 fill-red-500'
                                                : student.specialCase === 'exemption'
                                                    ? 'text-blue-500 fill-blue-500'
                                                    : student.specialCase === 'medical'
                                                        ? 'text-orange-500 fill-orange-500'
                                                        : student.specialCase === 'transfer'
                                                            ? 'text-green-500 fill-green-500'
                                                            : hasSpecialCase
                                                                ? 'text-purple-500 fill-purple-500'
                                                                : 'text-muted-foreground'
                                                }`} />
                                        </button>
                                    </TooltipTrigger>
                                </DropdownMenuTrigger>
                                {hasSpecialCase && (
                                    <TooltipContent side="top" sideOffset={5} className={`text-xs font-medium ${student.specialCase === 'longAbsence'
                                        ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200'
                                        : student.specialCase === 'exemption'
                                            ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200'
                                            : student.specialCase === 'medical'
                                                ? 'bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200'
                                                : student.specialCase === 'transfer'
                                                    ? 'bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200'
                                                    : 'bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border-purple-200'
                                        }`}>
                                        {['longAbsence', 'exemption', 'medical', 'transfer'].includes(student.specialCase || '')
                                            ? t(`pages.grades.specialCase.${student.specialCase}`)
                                            : student.specialCase
                                        }
                                    </TooltipContent>
                                )}
                            </Tooltip>
                        </TooltipProvider>
                        <DropdownMenuContent align="start">
                            {!isReadOnly ? (
                                <>
                                    <DropdownMenuItem
                                        onClick={() => updateStudent(student.id, { specialCase: 'longAbsence' })}
                                        className={student.specialCase === 'longAbsence' ? 'bg-red-50 dark:bg-red-950' : ''}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-red-500 ltr:mr-2 rtl:ml-2" />
                                        {t('pages.grades.specialCase.longAbsence')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => updateStudent(student.id, { specialCase: 'exemption' })}
                                        className={student.specialCase === 'exemption' ? 'bg-blue-50 dark:bg-blue-950' : ''}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-blue-500 ltr:mr-2 rtl:ml-2" />
                                        {t('pages.grades.specialCase.exemption')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => updateStudent(student.id, { specialCase: 'medical' })}
                                        className={student.specialCase === 'medical' ? 'bg-orange-50 dark:bg-orange-950' : ''}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-orange-500 ltr:mr-2 rtl:ml-2" />
                                        {t('pages.grades.specialCase.medical')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => updateStudent(student.id, { specialCase: 'transfer' })}
                                        className={student.specialCase === 'transfer' ? 'bg-green-50 dark:bg-green-950' : ''}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-green-500 ltr:mr-2 rtl:ml-2" />
                                        {t('pages.grades.specialCase.transfer')}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => {
                                            const customName = prompt(t('pages.grades.specialCase.enterCustom'))
                                            if (customName && customName.trim()) {
                                                updateStudent(student.id, { specialCase: customName.trim() })
                                            }
                                        }}
                                        className={hasSpecialCase && !['longAbsence', 'exemption', 'medical', 'transfer'].includes(student.specialCase || '') ? 'bg-purple-50 dark:bg-purple-950' : ''}
                                    >
                                        <span className="w-2 h-2 rounded-full bg-purple-500 ltr:mr-2 rtl:ml-2" />
                                        {t('pages.grades.specialCase.custom')}
                                    </DropdownMenuItem>
                                    {hasSpecialCase && (
                                        <>
                                            <DropdownMenuItem
                                                onClick={() => updateStudent(student.id, { specialCase: undefined })}
                                                className="text-muted-foreground"
                                            >
                                                {t('pages.grades.specialCase.clear')}
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </>
                            ) : (
                                <DropdownMenuItem disabled>
                                    {t('common.readOnly', { defaultValue: 'Read Only' })}
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </span>
            </TableCell>
            <TableCell className="text-center">{student.dateOfBirth}</TableCell>
            <EditableCell
                student={student}
                field="behavior"
                value={student.behavior}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
                handleCellEdit={handleCellEdit}
                t={t}
                isDisabled={isReadOnly}
            />
            <EditableCell
                student={student}
                field="applications"
                value={student.applications}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
                handleCellEdit={handleCellEdit}
                t={t}
                isDisabled={isReadOnly}
            />
            <EditableCell
                student={student}
                field="notebook"
                value={student.notebook}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
                handleCellEdit={handleCellEdit}
                t={t}
                isDisabled={isReadOnly}
            />
            <AttendanceCell
                student={student}
                type="lateness"
                count={student.lateness}
                onOpenAttendanceDialog={onOpenAttendanceDialog}
                onOpenHistoryDialog={onOpenHistoryDialog}
                t={t}
                isDisabled={isReadOnly}
            />
            <AttendanceCell
                student={student}
                type="absences"
                count={student.absences}
                onOpenAttendanceDialog={onOpenAttendanceDialog}
                onOpenHistoryDialog={onOpenHistoryDialog}
                t={t}
                isDisabled={isReadOnly}
            />
            <TableCell
                className="text-center font-semibold bg-primary/5 dark:bg-primary/10 text-primary cursor-not-allowed"
                onClick={() => toast.info(t('pages.grades.validation.caAutoCalculated'))}
            >
                {student.activityAverage}
            </TableCell>
            <EditableCell
                student={student}
                field="assignment"
                value={student.assignment}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
                handleCellEdit={handleCellEdit}
                t={t}
                isDisabled={isReadOnly}
            />
            <EditableCell
                student={student}
                field="exam"
                value={student.exam}
                editingCell={editingCell}
                setEditingCell={setEditingCell}
                handleCellEdit={handleCellEdit}
                t={t}
                isDisabled={isReadOnly}
            />
            <TableCell className="text-center font-bold text-lg bg-primary/10 dark:bg-primary/20 text-primary">{student.finalAverage.toFixed(2)}</TableCell>
            <TableCell className="font-semibold whitespace-nowrap truncate max-w-[140px]">{t(`pages.grades.remarks.${student.remarks}`)}</TableCell>
        </TableRow>
    )
}

export type { SortableStudentRowProps }
