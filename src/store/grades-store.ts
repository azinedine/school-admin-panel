import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

/**
 * Class Type
 */
export interface Class {
  id: string
  name: string
  subject: string
  grade: string
}

/**
 * Student Grade Type
 */
export interface StudentGrade {
  id: string
  classId: string
  lastName: string
  firstName: string
  dateOfBirth: string
  behavior: number
  applications: number
  notebook: number
  assignment: number
  exam: number
}

/**
 * Grades Store State
 */
interface GradesState {
  classes: Class[]
  students: StudentGrade[]
  selectedClassId: string | null
}

/**
 * Grades Store Actions
 */
interface GradesActions {
  setSelectedClass: (classId: string) => void
  addClass: (classData: Omit<Class, 'id'>) => string
  addStudentsToClass: (classId: string, students: (Omit<StudentGrade, 'id' | 'classId'> & { id?: string })[]) => void
  removeClass: (classId: string) => void
  updateStudent: (id: string, updates: Partial<StudentGrade>) => void
  updateStudentField: (id: string, field: keyof StudentGrade, value: number) => void
  getStudent: (id: string) => StudentGrade | undefined
  getStudentsByClass: (classId: string) => StudentGrade[]
  clearAllData: () => void
}

type GradesStore = GradesState & GradesActions

/**
 * Grades Store
 * 
 * Manages student grade data and classes with localStorage persistence.
 * Starts empty - teachers add classes via Excel or manual creation.
 */
export const useGradesStore = create<GradesStore>()(
  devtools(
    persist(
      (set, get) => ({
        classes: [],
        students: [],
        selectedClassId: null,

        setSelectedClass: (classId) =>
          set(
            { selectedClassId: classId },
            false,
            'grades/setSelectedClass'
          ),

        addClass: (classData) => {
          const id = `class-${crypto.randomUUID().slice(0, 8)}`
          set(
            (state) => ({
              classes: [...state.classes, { ...classData, id }],
              selectedClassId: state.selectedClassId || id,
            }),
            false,
            'grades/addClass'
          )
          return id
        },

        addStudentsToClass: (classId, studentsData) =>
          set(
            (state) => ({
              students: [
                ...state.students,
                ...studentsData.map((s) => ({
                  ...s,
                  id: s.id || crypto.randomUUID(),
                  classId,
                })),
              ],
            }),
            false,
            'grades/addStudentsToClass'
          ),

        removeClass: (classId) =>
          set(
            (state) => {
              const newClasses = state.classes.filter((c) => c.id !== classId)
              const newStudents = state.students.filter((s) => s.classId !== classId)
              return {
                classes: newClasses,
                students: newStudents,
                selectedClassId: state.selectedClassId === classId
                  ? (newClasses[0]?.id || null)
                  : state.selectedClassId,
              }
            },
            false,
            'grades/removeClass'
          ),

        updateStudent: (id, updates) =>
          set(
            (state) => ({
              students: state.students.map((s) =>
                s.id === id ? { ...s, ...updates } : s
              ),
            }),
            false,
            'grades/updateStudent'
          ),

        updateStudentField: (id, field, value) =>
          set(
            (state) => ({
              students: state.students.map((s) =>
                s.id === id ? { ...s, [field]: value } : s
              ),
            }),
            false,
            'grades/updateStudentField'
          ),

        getStudent: (id) => {
          return get().students.find((s) => s.id === id)
        },

        getStudentsByClass: (classId) => {
          return get().students.filter((s) => s.classId === classId)
        },

        clearAllData: () =>
          set(
            { classes: [], students: [], selectedClassId: null },
            false,
            'grades/clearAllData'
          ),
      }),
      {
        name: 'school-admin-grades',
      }
    ),
    { name: 'GradesStore' }
  )
)

/**
 * Hook to get students with selector
 */
export const useStudents = () => useGradesStore((state) => state.students)

/**
 * Hook to get classes
 */
export const useClasses = () => useGradesStore((state) => state.classes)

/**
 * Hook to get selected class
 */
export const useSelectedClass = () => useGradesStore((state) => state.selectedClassId)
