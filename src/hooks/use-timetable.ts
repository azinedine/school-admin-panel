import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient as api } from '@/lib/api-client'
import type { TimetableEntry } from '@/store/prep-store'

// Backend Type
interface ApiTimetableEntry {
    id: number
    user_id: number
    day: TimetableEntry['day']
    time_slot: string
    class: string
    mode: TimetableEntry['mode']
    group: TimetableEntry['group']
    created_at: string
    updated_at: string
}

// Transform API -> Frontend
function mapToTimetableEntry(apiEntry: ApiTimetableEntry): TimetableEntry {
    return {
        id: apiEntry.id.toString(), // Convert number ID to string for frontend consistency
        day: apiEntry.day,
        timeSlot: apiEntry.time_slot,
        class: apiEntry.class,
        mode: apiEntry.mode,
        group: apiEntry.group,
    }
}

// Transform Frontend -> API
function mapToApiEntry(entry: Omit<TimetableEntry, 'id'>): Omit<ApiTimetableEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'> {
    return {
        day: entry.day,
        time_slot: entry.timeSlot,
        class: entry.class,
        mode: entry.mode,
        group: entry.group,
    }
}

export function useTimetable() {
    return useQuery({
        queryKey: ['timetable'],
        queryFn: async () => {
            const res = await api.get<ApiTimetableEntry[]>('/timetable')
            return res.data.map(mapToTimetableEntry)
        },
    })
}

export function useUpdateTimetable() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (entries: Omit<TimetableEntry, 'id'>[]) => {
            const apiEntries = entries.map(mapToApiEntry)
            await api.post('/timetable', { entries: apiEntries })
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['timetable'] })
        },
    })
}
