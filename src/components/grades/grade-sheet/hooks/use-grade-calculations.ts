import { useMemo } from 'react'
import type { StudentGrade, CalculatedStudentGrade } from '../types'
import type { GradeStudent } from '@/features/grades'
import type { AttendanceRecord } from '@/store/attendance-store'
import { calculateFinalAverage, getRemarksKey, calculateContinuousAssessment } from '../utils'

/**
 * Hook to normalize and calculate student grades.
 *
 * Responsibility:
 * - Transforms raw API data into `StudentGrade` objects (normalization).
 * - Calculates derived fields like `activityAverage`, `finalAverage`, and `remarks`.
 * - Ensures all numeric fields are valid numbers.
 */
export function useGradeCalculations(
    studentsRaw: GradeStudent[],
    classId: string,
    getStudentAbsenceCount?: (id: string, year: string, term: number) => number,
    getStudentTardinessCount?: (id: string, year: string, term: number) => number,
    year?: string,
    term?: number | string,
    attendanceRecords?: AttendanceRecord[]
) {
    const students: StudentGrade[] = useMemo(() => {
        return studentsRaw.map(s => ({
            id: s.id,
            classId: classId || '',
            lastName: s.last_name,
            firstName: s.first_name,
            dateOfBirth: s.date_of_birth || '',
            behavior: Number(s.behavior) || 5, // Default to 5 if missing
            applications: Number(s.applications) || 5,
            notebook: Number(s.notebook) || 5,
            assignment: Number(s.assignment) || 0,
            exam: Number(s.exam) || 0,
            specialCase: s.special_case || undefined,
            // Pedagogical tracking fields
            oralInterrogation: Boolean(s.oral_interrogation),
            notebookChecked: Boolean(s.notebook_checked),
            lastInterrogationAt: s.last_interrogation_at || null,
            lastNotebookCheckAt: s.last_notebook_check_at || null,
        }))
    }, [studentsRaw, classId])

    const calculatedStudents: CalculatedStudentGrade[] = useMemo(() => {
        return students.map(student => {
            const absences = getStudentAbsenceCount?.(student.id, year || '', Number(term)) || 0
            const lateness = getStudentTardinessCount?.(student.id, year || '', Number(term)) || 0

            // Calculate Activity Average
            const activityAverage = calculateContinuousAssessment(
                student.behavior,
                student.applications,
                student.notebook,
                lateness,
                absences
            )

            // Calculate Final Average using standard formula
            const finalAverage = calculateFinalAverage(
                activityAverage,
                student.assignment,
                student.exam
            )

            return {
                ...student,
                absences,
                lateness,
                activityAverage,
                finalAverage,
                remarks: getRemarksKey(finalAverage),
            }
        })
    }, [students, getStudentAbsenceCount, getStudentTardinessCount, year, term, attendanceRecords])

    return { students, calculatedStudents }
}
