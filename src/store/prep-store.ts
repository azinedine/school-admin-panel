import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Data types
export interface DailyPlanEntry {
  id: string
  day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  timeSlot: string  // Changed to string to support dynamic time slots
  class: string
  mode: 'fullClass' | 'groups'
  group?: 'first' | 'second'  // Optional, only for 'groups' mode
  lessonTitle: string
  lessonContent: string
  practiceNotes: string
  weekNumber?: number  // Week of term (1, 2, 3...)
  date?: string  // Specific date (YYYY-MM-DD)
  status?: 'completed' | 'postponed' | 'cancelled' | 'custom' | 'deleted'
  statusNote?: string  // Custom note for postponed/deleted status
  // Detailed lesson structure
  field?: string  // الميدان - Field / Subject Area
  learningSegment?: string  // المقطع التعلمي - Learning Segment
  knowledgeResource?: string  // المورد المعرفي - Knowledge Resource
  lessonElements?: string[]  // عناصر الدرس - Lesson Elements (list)
  assessment?: string  // تقويم - Assessment / Evaluation
  homework?: boolean  // واجب منزلي - Homework
  practicalWork?: boolean  // عمل تطبيقي - Practical Work
  secondaryTimeSlot?: string // توقيت الحصة الثانية - Secondary Time Slot
}

export interface TimetableEntry {
  id: string
  day: 'sunday' | 'monday' | 'tuesday' | 'wednesday' | 'thursday'
  timeSlot: string  // e.g., "08:00-09:00"
  class: string
  mode: 'fullClass' | 'groups'
  group?: 'first' | 'second'  // Optional, only for 'groups' mode
}

// Lesson Template - reusable lessons organized by academic year
export interface LessonTemplate {
  id: string
  academicYear: '1st' | '2nd' | '3rd' | '4th'
  lessonTitle: string
  field: string
  learningSegment: string
  knowledgeResource: string
  lessonElements: string[]
  assessment: string
  homework?: boolean
  practicalWork?: boolean
  secondaryTimeSlot?: string
  lessonContent: string
  practiceNotes: string
  createdAt: string
}

// Memo Template
export interface MemoTemplate {
  id: string
  title: string
  content: string
  createdAt: string
  reference?: string
  date?: string
}

// State interface
interface PrepState {
  planEntries: DailyPlanEntry[]
  timetable: TimetableEntry[]
  isTimetableInitialized: boolean
  termStartDate: string | null
  termEndDate: string | null
  lessonTemplates: LessonTemplate[]
  memos: MemoTemplate[]
}

// Actions interface
interface PrepActions {
  // Lesson plan actions
  addPlanEntry: (entry: Omit<DailyPlanEntry, 'id'>) => void
  updatePlanEntry: (id: string, updates: Partial<DailyPlanEntry>) => void
  deletePlanEntry: (id: string) => void
  getPlanByDay: (day: DailyPlanEntry['day']) => DailyPlanEntry[]
  getPlanByDayAndSlot: (day: string, timeSlot: string, group: string) => DailyPlanEntry | undefined
  getPlanByWeek: (weekNumber: number) => DailyPlanEntry[]
  getPlanByWeekAndDay: (weekNumber: number, day: DailyPlanEntry['day']) => DailyPlanEntry[]
  clearAllPlans: () => void
  
  // Timetable actions
  setTimetable: (entries: Omit<TimetableEntry, 'id'>[]) => void
  getTimetableByDay: (day: TimetableEntry['day']) => TimetableEntry[]
  getAllTimetableSlots: () => TimetableEntry[]
  initializeTimetable: (entries: Omit<TimetableEntry, 'id'>[]) => void
  clearTimetable: () => void
  
  // Term date actions
  setTermDates: (startDate: string, endDate: string) => void
  getTermDates: () => { startDate: string | null; endDate: string | null }
  clearTermDates: () => void
  
  // Lesson template actions
  addLessonTemplate: (template: Omit<LessonTemplate, 'id' | 'createdAt'>) => void
  updateLessonTemplate: (id: string, updates: Partial<LessonTemplate>) => void
  deleteLessonTemplate: (id: string) => void
  getLessonTemplatesByYear: (year: LessonTemplate['academicYear']) => LessonTemplate[]
  getAllLessonTemplates: () => LessonTemplate[]

  // Memo actions
  addMemo: (memo: Omit<MemoTemplate, 'id' | 'createdAt'>) => void
  updateMemo: (id: string, updates: Partial<MemoTemplate>) => void
  deleteMemo: (id: string) => void
  getAllMemos: () => MemoTemplate[]
}

// Combined store type
export type PrepStore = PrepState & PrepActions

// Create the store
export const usePrepStore = create<PrepStore>()(
  persist(
    (set, get) => ({
      // Initial state
      planEntries: [],
      timetable: [],
      isTimetableInitialized: false,
      termStartDate: null,
      termEndDate: null,
      lessonTemplates: [],
      memos: [],

      // Lesson plan actions
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

      getPlanByWeek: (weekNumber) => {
        return get().planEntries.filter((entry) => entry.weekNumber === weekNumber)
      },

      getPlanByWeekAndDay: (weekNumber, day) => {
        return get().planEntries.filter(
          (entry) => entry.weekNumber === weekNumber && entry.day === day
        )
      },

      clearAllPlans: () => set({ planEntries: [] }),

      // Timetable actions
      setTimetable: (entries) =>
        set({
          timetable: entries.map((entry) => ({
            ...entry,
            id: crypto.randomUUID(),
          })),
        }),

      getTimetableByDay: (day) => {
        return get().timetable.filter((entry) => entry.day === day)
      },

      getAllTimetableSlots: () => {
        return get().timetable
      },

      initializeTimetable: (entries) =>
        set({
          timetable: entries.map((entry) => ({
            ...entry,
            id: crypto.randomUUID(),
          })),
          isTimetableInitialized: true,
        }),

      clearTimetable: () =>
        set({
          timetable: [],
          isTimetableInitialized: false,
        }),

      // Term date actions
      setTermDates: (startDate, endDate) =>
        set({
          termStartDate: startDate,
          termEndDate: endDate,
        }),

      getTermDates: () => ({
        startDate: get().termStartDate,
        endDate: get().termEndDate,
      }),

      clearTermDates: () =>
        set({
          termStartDate: null,
          termEndDate: null,
        }),

      // Lesson template actions
      addLessonTemplate: (template) =>
        set((state) => ({
          lessonTemplates: [
            ...state.lessonTemplates,
            {
              ...template,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateLessonTemplate: (id, updates) =>
        set((state) => ({
          lessonTemplates: state.lessonTemplates.map((template) =>
            template.id === id ? { ...template, ...updates } : template
          ),
        })),

      deleteLessonTemplate: (id) =>
        set((state) => ({
          lessonTemplates: state.lessonTemplates.filter((template) => template.id !== id),
        })),

      getLessonTemplatesByYear: (year) => {
        return get().lessonTemplates.filter((template) => template.academicYear === year)
      },

      getAllLessonTemplates: () => {
        return get().lessonTemplates
      },

      // Memo actions
      addMemo: (memo) =>
        set((state) => ({
          memos: [
            ...state.memos,
            {
              ...memo,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateMemo: (id, updates) =>
        set((state) => ({
          memos: state.memos.map((memo) =>
            memo.id === id ? { ...memo, ...updates } : memo
          ),
        })),

      deleteMemo: (id) =>
        set((state) => ({
          memos: state.memos.filter((memo) => memo.id !== id),
        })),

      getAllMemos: () => {
        return get().memos
      },
    }),
    {
      name: 'school-admin-prep',
    }
  )
)
