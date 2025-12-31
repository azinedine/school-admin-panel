import type { Subject } from '@/hooks/use-subjects'

/**
 * Subject Utilities
 * 
 * Provides reusable functions for subject-related operations
 * following the Single Responsibility Principle.
 */

/**
 * Filters subjects from the API list based on user's assigned subject names.
 * Uses case-insensitive matching to handle variations in casing.
 * 
 * @param subjectsList - Full list of subjects from API
 * @param userSubjects - User's assigned subject names
 * @returns Filtered array of Subject objects
 */
export function filterSubjectsByUserAssignment(
    subjectsList: Subject[],
    userSubjects: string[] | undefined | null
): Subject[] {
    if (!userSubjects || userSubjects.length === 0) return []

    return subjectsList.filter(subject =>
        userSubjects.some(userSubj =>
            userSubj.toLowerCase() === subject.name.toLowerCase() ||
            userSubj.toLowerCase() === subject.name_ar.toLowerCase()
        )
    )
}

/**
 * Maps subjects to display names based on current language.
 * 
 * @param subjects - Array of Subject objects
 * @param isRTL - Whether the current language is RTL (Arabic)
 * @returns Array of display names
 */
export function getSubjectDisplayNames(
    subjects: Subject[],
    isRTL: boolean
): string[] {
    return subjects.map(s => isRTL ? s.name_ar : s.name)
}

/**
 * Finds a subject ID by matching a name (case-insensitive).
 * 
 * @param subjectsList - Full list of subjects from API
 * @param name - Subject name to find
 * @returns Subject ID as string, or null if not found
 */
export function findSubjectIdByName(
    subjectsList: Subject[],
    name: string
): string | null {
    const nameLower = name.toLowerCase()
    const found = subjectsList.find(s =>
        s.name.toLowerCase() === nameLower ||
        s.name_ar.toLowerCase() === nameLower
    )
    return found ? found.id.toString() : null
}

/**
 * Maps an array of subject names to their corresponding IDs.
 * 
 * @param subjectsList - Full list of subjects from API
 * @param subjectNames - Array of subject names
 * @returns Array of subject IDs (as strings)
 */
export function mapSubjectNamesToIds(
    subjectsList: Subject[],
    subjectNames: string[] | undefined | null
): string[] {
    if (!subjectNames || subjectNames.length === 0) return []

    return subjectNames
        .map(name => findSubjectIdByName(subjectsList, name))
        .filter((id): id is string => id !== null)
}

/**
 * Maps an array of subject IDs to their corresponding names.
 * 
 * @param subjectsList - Full list of subjects from API
 * @param subjectIds - Array of subject IDs (as strings)
 * @param isRTL - Whether to return Arabic names
 * @returns Array of subject names
 */
export function mapSubjectIdsToNames(
    subjectsList: Subject[],
    subjectIds: string[] | undefined | null,
    isRTL: boolean = false
): string[] {
    if (!subjectIds || subjectIds.length === 0) return []

    return subjectIds
        .map(id => {
            const subject = subjectsList.find(s => s.id.toString() === id)
            return subject ? (isRTL ? subject.name_ar : subject.name) : null
        })
        .filter((name): name is string => name !== null)
}
