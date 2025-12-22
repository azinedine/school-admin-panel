import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * Attendance Record Type
 */
export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  classId: string
  year: string      // NEW: Academic Year
  term: number      // NEW: Term (1 | 2 | 3)
  date: string       // ISO date format YYYY-MM-DD
  time: string       // HH:mm format
  type: 'absence' | 'tardiness'
  createdAt: string  // ISO timestamp
}

/**
 * Attendance Store State
 */
interface AttendanceState {
  records: AttendanceRecord[]
}

/**
 * Attendance Store Actions
 */
interface AttendanceActions {
  addRecord: (record: Omit<AttendanceRecord, 'id' | 'createdAt'>) => void
  removeRecord: (id: string) => void
  getStudentRecords: (studentId: string, year: string, term: number) => AttendanceRecord[]
  getStudentAbsenceCount: (studentId: string, year: string, term: number) => number
  getStudentTardinessCount: (studentId: string, year: string, term: number) => number
  clearStudentRecords: (studentId: string) => void
}

type AttendanceStore = AttendanceState & AttendanceActions

/**
 * Attendance Store
 * 
 * Manages attendance records (absences and tardiness) with localStorage persistence.
 */
export const useAttendanceStore = create<AttendanceStore>()(
  devtools(
    persist(
      (set, get) => ({
        records: [],

        addRecord: (record) =>
          set(
            (state) => ({
              records: [
                ...state.records,
                {
                  ...record,
                  id: crypto.randomUUID(),
                  createdAt: new Date().toISOString(),
                },
              ],
            }),
            false,
            'attendance/addRecord'
          ),

        removeRecord: (id) =>
          set(
            (state) => ({
              records: state.records.filter((r) => r.id !== id),
            }),
            false,
            'attendance/removeRecord'
          ),

        getStudentRecords: (studentId, year, term) => {
          return get().records.filter((r) => 
            r.studentId === studentId && 
            r.year === year && 
            r.term === term
          )
        },

        getStudentAbsenceCount: (studentId, year, term) => {
          return get().records.filter(
            (r) => r.studentId === studentId && 
                   r.type === 'absence' &&
                   r.year === year && 
                   r.term === term
          ).length
        },

        getStudentTardinessCount: (studentId, year, term) => {
          return get().records.filter(
            (r) => r.studentId === studentId && 
                   r.type === 'tardiness' &&
                   r.year === year && 
                   r.term === term
          ).length
        },

        clearStudentRecords: (studentId) =>
          set(
            (state) => ({
              records: state.records.filter((r) => r.studentId !== studentId),
            }),
            false,
            'attendance/clearStudentRecords'
          ),
      }),
      {
         name: 'school-admin-attendance',
         version: 1,
         migrate: (persistedState: unknown, version: number): AttendanceState => {
             if (version === 0) {
                 // Migrate old records to default year/term
                 const state = persistedState as Partial<AttendanceState>
                 const oldRecords = (state?.records || []) as AttendanceRecord[]
                 const newRecords = oldRecords.map((r: AttendanceRecord) => ({
                     ...r,
                     year: "2024-2025",
                     term: 1
                 }))
                 return { ...state, records: newRecords } as AttendanceState
             }
             return persistedState as AttendanceState
         }
      }
    ),
    { name: 'AttendanceStore' }
  )
)
