import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Data types
export interface DailyPlanEntry {
  id: string
  day: 'sunday' | 'monday' | 'wednesday' | 'thursday'
  timeSlot: '08:00-09:00' | '09:00-10:00' | '10:00-11:00' | '11:00-12:00'
  group: 'first' | 'second'
  class: string
  lessonTitle: string
  lessonContent: string
  practiceNotes: string
}

// State interface
interface PrepState {
  planEntries: DailyPlanEntry[]
}

// Actions interface
interface PrepActions {
  addPlanEntry: (entry: Omit<DailyPlanEntry, 'id'>) => void
  updatePlanEntry: (id: string, updates: Partial<DailyPlanEntry>) => void
  deletePlanEntry: (id: string) => void
  getPlanByDay: (day: DailyPlanEntry['day']) => DailyPlanEntry[]
  getPlanByDayAndSlot: (day: DailyPlanEntry['day'], timeSlot: DailyPlanEntry['timeSlot'], group: DailyPlanEntry['group']) => DailyPlanEntry | undefined
  clearAllPlans: () => void
}

// Combined store type
export type PrepStore = PrepState & PrepActions

// Create the store
export const usePrepStore = create<PrepStore>()(
  persist(
    (set, get) => ({
      // Initial state
      planEntries: [],

      // Actions
      addPlanEntry: (entry) =>
        set((state) => ({
          planEntries: [
            ...state.planEntries,
            {
              ...entry,
              id: crypto.randomUUID(),
            },
          ],
        })),

      updatePlanEntry: (id, updates) =>
        set((state) => ({
          planEntries: state.planEntries.map((entry) =>
            entry.id === id ? { ...entry, ...updates } : entry
          ),
        })),

      deletePlanEntry: (id) =>
        set((state) => ({
          planEntries: state.planEntries.filter((entry) => entry.id !== id),
        })),

      getPlanByDay: (day) => {
        return get().planEntries.filter((entry) => entry.day === day)
      },

      getPlanByDayAndSlot: (day, timeSlot, group) => {
        return get().planEntries.find(
          (entry) => entry.day === day && entry.timeSlot === timeSlot && entry.group === group
        )
      },

      clearAllPlans: () => set({ planEntries: [] }),
    }),
    {
      name: 'school-admin-prep',
    }
  )
)
