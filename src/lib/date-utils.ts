/**
 * Calculate which week of the term a given date falls in
 * @param date - The date to check (YYYY-MM-DD format)
 * @param termStartDate - The term start date (YYYY-MM-DD format)
 * @returns Week number (1-based) or null if date is before term start
 */
export function getWeekNumber(date: string, termStartDate: string): number | null {
  const targetDate = new Date(date)
  const startDate = new Date(termStartDate)

  if (targetDate < startDate) {
    return null
  }

  const diffTime = targetDate.getTime() - startDate.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const weekNumber = Math.floor(diffDays / 7) + 1

  return weekNumber
}

/**
 * Get all weeks in a term
 * @param termStartDate - The term start date (YYYY-MM-DD format)
 * @param termEndDate - The term end date (YYYY-MM-DD format)
 * @returns Array of week objects with week number, start date, and end date
 */
export function getTermWeeks(
  termStartDate: string,
  termEndDate: string
): Array<{ weekNumber: number; startDate: string; endDate: string }> {
  const start = new Date(termStartDate)
  const end = new Date(termEndDate)
  const weeks: Array<{ weekNumber: number; startDate: string; endDate: string }> = []

  let weekNumber = 1
  const currentWeekStart = new Date(start)

  while (currentWeekStart <= end) {
    const currentWeekEnd = new Date(currentWeekStart)
    currentWeekEnd.setDate(currentWeekEnd.getDate() + 6)

    // Don't let week end go past term end
    const weekEndDate = currentWeekEnd > end ? end : currentWeekEnd

    weeks.push({
      weekNumber,
      startDate: currentWeekStart.toISOString().split('T')[0],
      endDate: weekEndDate.toISOString().split('T')[0],
    })

    // Move to next week
    currentWeekStart.setDate(currentWeekStart.getDate() + 7)
    weekNumber++
  }

  return weeks
}

/**
 * Format a date range for display
 * @param startDate - Start date (YYYY-MM-DD format)
 * @param endDate - End date (YYYY-MM-DD format)  
 * @param locale - Locale for formatting (e.g., 'en', 'fr', 'ar')
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: string, endDate: string, locale: string = 'en'): string {
  const start = new Date(startDate)
  const end = new Date(endDate)

  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }

  const startStr = start.toLocaleDateString(locale, options)
  const endStr = end.toLocaleDateString(locale, options)

  return `${startStr} - ${endStr}`
}
