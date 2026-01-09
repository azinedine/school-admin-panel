import { useMemo } from 'react'
import { useAttendanceStore } from '@/store/attendance-store'
import type { StudentGrade, CalculatedStudentGrade } from '../types'
import {
    calculateContinuousAssessment,
    calculateFinalAverage,
    getRemarksKey,
} from '../utils'

/**
 * Hook for calculating student grades with attendance data
 */
export function useGradeCalculations(
    students: StudentGrade[],
    selectedClassId: string | null,
    selectedYear: string,
    selectedTerm: number
) {
    const { getStudentAbsenceCount, getStudentTardinessCount, records } = useAttendanceStore()

    const calculatedStudents = useMemo((): CalculatedStudentGrade[] => {
        return students
            .filter(student => student.classId === selectedClassId)
            .map(student => {
                const absenceCount = getStudentAbsenceCount(student.id, selectedYear, selectedTerm)
                const tardinessCount = getStudentTardinessCount(student.id, selectedYear, selectedTerm)

                const activityAverage = calculateContinuousAssessment(
                    student.behavior,
                    student.applications,
                    student.notebook,
                    tardinessCount,
                    absenceCount
                )

                const finalAverage = calculateFinalAverage(activityAverage, student.assignment, student.exam)

                return {
                    ...student,
                    lateness: tardinessCount,
                    absences: absenceCount,
                    activityAverage,
                    finalAverage,
                    remarks: getRemarksKey(finalAverage)
                }
            })
    }, [students, records, selectedClassId, getStudentAbsenceCount, getStudentTardinessCount, selectedYear, selectedTerm])

    // Calculate class statistics
    const classStatistics = useMemo(() => {
        if (calculatedStudents.length === 0) {
            return {
                classAverage: 0,
                passRate: 0,
                totalStudents: 0,
            }
        }

        const total = calculatedStudents.reduce((sum, s) => sum + s.finalAverage, 0)
        const passCount = calculatedStudents.filter(s => s.finalAverage >= 10).length

        return {
            classAverage: Number((total / calculatedStudents.length).toFixed(2)),
            passRate: Number(((passCount / calculatedStudents.length) * 100).toFixed(1)),
            totalStudents: calculatedStudents.length,
        }
    }, [calculatedStudents])

    return {
        calculatedStudents,
        classStatistics,
    }
}
