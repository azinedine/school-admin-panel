/**
 * Utility to calculate the current academic year based on the current date.
 * Academic year starts in September (Month index 8).
 * 
 * Example:
 * - Date: 2024-01-15 -> Academic Year: "2023-2024"
 * - Date: 2024-09-01 -> Academic Year: "2024-2025"
 */
export const getAcademicYear = (): string => {
    const now = new Date()
    const month = now.getMonth() // 0-11
    const year = now.getFullYear()

    // If month is September (8) or later, the academic year starts in the current calendar year.
    // Otherwise, it started in the previous calendar year.
    const startYear = month >= 8 ? year : year - 1

    return `${startYear}-${startYear + 1}`
}
