// Field configuration with min/max values for validation
export const FIELD_CONFIG: Record<string, { min: number; max: number; step: number; labelKey: string }> = {
    behavior: { min: 0, max: 5, step: 0.5, labelKey: 'pages.grades.table.behavior' },
    applications: { min: 0, max: 5, step: 0.5, labelKey: 'pages.grades.table.applications' },
    notebook: { min: 0, max: 5, step: 0.5, labelKey: 'pages.grades.table.notebook' },
    assignment: { min: 0, max: 20, step: 0.5, labelKey: 'pages.grades.table.assignment' },
    exam: { min: 0, max: 20, step: 0.5, labelKey: 'pages.grades.table.exam' },
}

// Valid grade levels
export const VALID_LEVELS = ['1AP', '2AP', '3AP', '4AP', '5AP'] as const

// Calculate continuous assessment from all 5 components
// Each component contributes 0-5 points for a total of 0-25, scaled to 0-20
// Components: Behavior, Participation (applications), Notebook, Tardiness (5 - count), Absences (5 - count)
export function calculateContinuousAssessment(
    behavior: number,       // 0-5 score
    participation: number,  // 0-5 score (applications)
    notebook: number,       // 0-5 score
    tardinessCount: number, // number of tardiness records
    absenceCount: number    // number of absence records
): number {
    // Behavior, Participation, Notebook are direct scores (0-5)
    const behaviorScore = Math.min(5, Math.max(0, behavior))
    const participationScore = Math.min(5, Math.max(0, participation))
    const notebookScore = Math.min(5, Math.max(0, notebook))

    // Tardiness and Absences start at 5, deduct 1 per record (min 0)
    const tardinessScore = Math.max(0, 5 - tardinessCount)
    const absenceScore = Math.max(0, 5 - absenceCount)

    // Total out of 25, scaled to 20
    const total = behaviorScore + participationScore + notebookScore + tardinessScore + absenceScore
    return Number((total * 20 / 25).toFixed(2))
}

export function calculateFinalAverage(activityAverage: number, assignment: number, exam: number): number {
    return Number(((activityAverage + assignment + exam) / 3).toFixed(2))
}

export function getRemarksKey(average: number): string {
    if (average >= 16) return "excellent"
    if (average >= 14) return "veryGood"
    if (average >= 12) return "good"
    if (average >= 10) return "average"
    return "poor"
}

export function getRowColor(average: number): string {
    if (average < 10) return "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-950/30"
    if (average < 14) return "bg-yellow-50 dark:bg-yellow-950/20 hover:bg-yellow-100 dark:hover:bg-yellow-950/30"
    return "bg-green-50 dark:bg-green-950/20 hover:bg-green-100 dark:hover:bg-green-950/30"
}
