import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createIndexedDBStorage } from './storage'

/**
 * Attendance Record Type
 */
export interface AttendanceRecord {
  id: string
  studentId: string
  studentName: string
  classId: string
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
  getStudentRecords: (studentId: string) => AttendanceRecord[]
  getStudentAbsenceCount: (studentId: string) => number
  getStudentTardinessCount: (studentId: string) => number
  clearStudentRecords: (studentId: string) => void
}

type AttendanceStore = AttendanceState & AttendanceActions

/**
 * Pre-configured IndexedDB storage for attendance
 */
const attendanceStorage = createIndexedDBStorage('school-admin-db', 'attendance-store')

/**
 * Attendance Store
 * 
 * Manages attendance records (absences and tardiness) with IndexedDB persistence.
 * 
 * @example
 * ```tsx
 * import { useAttendanceStore } from '@/store/attendance-store'
 * 
 * function AttendanceButton({ student }) {
 *   const { addRecord, getStudentAbsenceCount } = useAttendanceStore()
 *   
 *   const recordAbsence = () => {
 *     addRecord({
 *       studentId: student.id,
 *       studentName: `${student.firstName} ${student.lastName}`,
 *       classId: 'class-1',
 *       date: new Date().toISOString().split('T')[0],
 *       time: new Date().toTimeString().slice(0, 5),
 *       type: 'absence'
 *     })
 *   }
 *   
 *   return (
 *     <button onClick={recordAbsence}>
 *       Absences: {getStudentAbsenceCount(student.id)}
 *     </button>
 *   )
 * }
 * ```
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

        getStudentRecords: (studentId) => {
          return get().records.filter((r) => r.studentId === studentId)
        },

        getStudentAbsenceCount: (studentId) => {
          return get().records.filter(
            (r) => r.studentId === studentId && r.type === 'absence'
          ).length
        },

        getStudentTardinessCount: (studentId) => {
          return get().records.filter(
            (r) => r.studentId === studentId && r.type === 'tardiness'
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
        name: 'attendance-records',
        storage: attendanceStorage as any,
      }
    ),
    { name: 'AttendanceStore' }
  )
)

/**
 * Selector hooks for optimized re-renders
 */
export const useAttendanceRecords = () => 
  useAttendanceStore((state) => state.records)
