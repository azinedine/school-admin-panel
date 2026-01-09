import { useMemo } from 'react'
import type { CalculatedStudentGrade } from '../types'

export interface GradeSheetStatistics {
    classAverage: string
    total: number
    passed: number
    failed: number
    passRate: string
    failRate: string
    specialCaseCount: number
}

/**
 * Hook to calculate class statistics.
 *
 * Responsibility:
 * - Computes aggregations like class average, pass/fail counts.
 * - Pure calculation based on provided students list.
 */
export function useGradeStatistics(students: CalculatedStudentGrade[]): GradeSheetStatistics {
    return useMemo(() => {
        if (students.length === 0) {
            return {
                classAverage: "0.00",
                total: 0,
                passed: 0,
                failed: 0,
                passRate: "0.0",
                failRate: "0.0",
                specialCaseCount: 0
            }
        }

        const total = students.length
        const sumAverage = students.reduce((acc, s) => acc + s.finalAverage, 0)
        const passed = students.filter(s => s.finalAverage >= 10).length
        const failed = total - passed
        const specialCaseCount = students.filter(s => !!s.specialCase).length

        return {
            classAverage: (sumAverage / total).toFixed(2),
            total,
            passed,
            failed,
            passRate: ((passed / total) * 100).toFixed(1),
            failRate: ((failed / total) * 100).toFixed(1),
            specialCaseCount
        }
    }, [students])
}


