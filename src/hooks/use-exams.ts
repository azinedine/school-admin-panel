import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

/**
 * Exam type definition
 * Adjust this according to your actual API response
 */
export interface Exam {
  id: number
  title: string
  subject: string
  date: string
  duration?: number
  totalMarks?: number
  class?: string
}

/**
 * Fetch all exams from the API
 */
const fetchExams = async (): Promise<Exam[]> => {
  const response = await apiClient.get<Exam[]>('/exams')
  return response.data
}

/**
 * Hook to fetch all exams
 * 
 * @example
 * ```tsx
 * function ExamsPage() {
 *   const { data: exams, isLoading, error } = useExams()
 *   
 *   if (isLoading) return <div>Loading...</div>
 *   if (error) return <div>Error loading exams</div>
 *   
 *   return (
 *     <div>
 *       {exams?.map(exam => (
 *         <div key={exam.id}>{exam.title}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useExams() {
  return useQuery({
    queryKey: ['exams'],
    queryFn: fetchExams,
    staleTime: 1000 * 30, // 30 seconds - exams data is fairly static
  })
}

/**
 * Fetch exams for a specific month
 */
const fetchExamsByMonth = async (year: number, month: number): Promise<Exam[]> => {
  const response = await apiClient.get<Exam[]>('/exams', {
    params: { year, month }
  })
  return response.data
}

/**
 * Hook to fetch exams for a specific month
 * 
 * @param year - Year (e.g., 2024)
 * @param month - Month (1-12)
 */
export function useExamsByMonth(year: number, month: number) {
  return useQuery({
    queryKey: ['exams', 'month', year, month],
    queryFn: () => fetchExamsByMonth(year, month),
    enabled: !!year && !!month,
  })
}
