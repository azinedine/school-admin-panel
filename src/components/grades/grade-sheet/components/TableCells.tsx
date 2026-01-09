import type React from "react"
import { ArrowUpDown, UserMinus, Clock, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    TableCell,
    TableHead,
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
import type { CalculatedStudentGrade, StudentGrade, SortField } from "../types"
import { FIELD_CONFIG } from "../constants"

// Sortable Header Component
interface SortableHeaderProps {
    field: SortField
    children: React.ReactNode
    highlight?: boolean
    onSort: (field: SortField) => void
}

export function SortableHeader({ field, children, highlight, onSort }: SortableHeaderProps) {
    return (
        <TableHead className={`text-center font-bold ${highlight ? 'bg-primary/5 dark:bg-primary/10' : ''}`}>
            <Button
                variant="ghost"
                onClick={() => onSort(field)}
                className={`h-auto p-0 hover:bg-transparent font-bold ${highlight ? 'text-primary' : ''}`}
            >
                {children}
                <ArrowUpDown className="h-3 w-3 ltr:ml-2 rtl:mr-2" />
            </Button>
        </TableHead>
    )
}

// Editable Cell Component
interface EditableCellProps {
    student: CalculatedStudentGrade
    field: keyof StudentGrade
    value: number
    editingCell: { id: string; field: string } | null
    setEditingCell: (cell: { id: string; field: string } | null) => void
    handleCellEdit: (id: string, field: keyof StudentGrade, value: string, keepOpen?: boolean) => void
    t: (key: string, opts?: Record<string, unknown>) => string
    isDisabled?: boolean
}

export function EditableCell({
    student,
    field,
    value,
    editingCell,
    setEditingCell,
    handleCellEdit,
    t,
    isDisabled = false,
}: EditableCellProps) {
    const isEditing = editingCell?.id === student.id && editingCell?.field === field
    const config = FIELD_CONFIG[field] || { min: 0, max: 20, step: 0.5, labelKey: field }

    const handleValidatedEdit = (newValue: string, keepOpen: boolean = false) => {
        const numValue = parseFloat(newValue)
        if (isNaN(numValue)) {
            if (!keepOpen) setEditingCell(null)
            return
        }

        // Clamp value to valid range
        const clampedValue = Math.min(config.max, Math.max(config.min, numValue))

        // Show warning if value was clamped
        if (numValue > config.max) {
            toast.warning(t('pages.grades.validation.maxReached', {
                field: t(config.labelKey),
                max: config.max
            }))
        } else if (numValue < config.min) {
            toast.warning(t('pages.grades.validation.minReached', {
                field: t(config.labelKey),
                min: config.min
            }))
        }

        handleCellEdit(student.id, field, clampedValue.toString(), keepOpen)
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <TableCell
                        className={`text-center ${!isDisabled ? 'cursor-pointer hover:bg-muted/50' : ''}`}
                        onClick={() => !isDisabled && setEditingCell({ id: student.id, field })}
                    >
                        {isEditing ? (
                            <Input
                                type="number"
                                defaultValue={value}
                                autoFocus
                                className="w-16 h-8 text-center"
                                onFocus={(e) => e.target.select()}
                                onBlur={(e) => {
                                    const newValue = e.target.value.trim()
                                    // If empty, revert to original value
                                    if (newValue === '') {
                                        setEditingCell(null)
                                    } else {
                                        handleValidatedEdit(newValue)
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const newValue = (e.target as HTMLInputElement).value.trim()
                                        if (newValue === '') {
                                            setEditingCell(null)
                                        } else {
                                            handleValidatedEdit(newValue)
                                        }
                                    }
                                    if (e.key === 'Escape') {
                                        setEditingCell(null)
                                    }
                                }}
                                min={config.min}
                                max={config.max}
                                step={config.step}
                            />
                        ) : (
                            <span>{value}</span>
                        )}
                    </TableCell>
                </TooltipTrigger>
                <TooltipContent side="top">
                    <p className="text-xs">
                        {t(config.labelKey)}: {config.min} - {config.max}
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

// Attendance Cell Component
interface AttendanceCellProps {
    student: CalculatedStudentGrade
    type: 'absences' | 'lateness'
    count: number
    onOpenAttendanceDialog: (student: CalculatedStudentGrade, type: 'absence' | 'tardiness') => void
    onOpenHistoryDialog: (student: CalculatedStudentGrade) => void
    t: (key: string) => string
    isDisabled?: boolean
}

export function AttendanceCell({
    student,
    type,
    count,
    onOpenAttendanceDialog,
    onOpenHistoryDialog,
    t,
    isDisabled = false,
}: AttendanceCellProps) {
    return (
        <TableCell className="text-center">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 px-2 ${count > 0 ? 'text-red-600 font-bold' : ''}`}
                    >
                        {count}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center">
                    {!isDisabled && (
                        <DropdownMenuItem onClick={() => onOpenAttendanceDialog(student, type === 'absences' ? 'absence' : 'tardiness')}>
                            {type === 'absences' ? <UserMinus className="h-4 w-4 ltr:mr-2 rtl:ml-2" /> : <Clock className="h-4 w-4 ltr:mr-2 rtl:ml-2" />}
                            {type === 'absences' ? t('pages.grades.attendance.recordAbsence') : t('pages.grades.attendance.recordTardiness')}
                        </DropdownMenuItem>
                    )}
                    {count > 0 && (
                        <DropdownMenuItem onClick={() => onOpenHistoryDialog(student)}>
                            <History className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                            {t('pages.grades.attendance.viewHistory')}
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </TableCell>
    )
}
