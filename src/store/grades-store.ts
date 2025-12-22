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
 * Term Type
 */
export type Term = 1 | 2 | 3

/**
 * Constants
 */
export const DEFAULT_YEAR = "2024-2025"
export const CURRENT_YEAR = "2024-2025"

/**
 * Term Grades Interface (The actual grade data)
 */
export interface TermGrades {
  behavior: number
  applications: number
  notebook: number
  assignment: number
  exam: number
}

/**
 * Student Data Interface (Internal storage with nested grades)
 */
export interface StudentData {
  id: string
  classId: string
  lastName: string
  firstName: string
  dateOfBirth: string
  specialCase?: string
  // Map of "Year" -> "Term" -> Grades
  grades: Record<string, Record<number, TermGrades>>
}

/**
 * Student Grade Type (The flat view used by UI)
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
  specialCase?: string 
}

/**
 * Grades Store State
 */
interface GradesState {
  classes: Class[]
  studentRecords: StudentData[] // The master data
  students: StudentGrade[] // The computed view for current context
  selectedClassId: string | null
  selectedYear: string
  selectedTerm: Term
}

/**
 * Grades Store Actions
 */
interface GradesActions {
  setSelectedClass: (classId: string) => void
  setYear: (year: string) => void
  setTerm: (term: Term) => void
  addClass: (classData: Omit<Class, 'id'>) => string
  addStudentsToClass: (classId: string, students: (Omit<StudentGrade, 'id' | 'classId'> & { id?: string })[]) => void
  removeClass: (classId: string) => void
  updateStudent: (id: string, updates: Partial<StudentGrade>) => void
  updateStudentField: (id: string, field: keyof StudentGrade, value: number) => void
  reorderStudents: (classId: string, orderedIds: string[]) => void
  getStudent: (id: string) => StudentGrade | undefined
  getStudentsByClass: (classId: string) => StudentGrade[]
  clearAllData: () => void
}

type GradesStore = GradesState & GradesActions

// Helper to project nested data to flat view
const projectStudents = (records: StudentData[], year: string, term: Term): StudentGrade[] => {
  return records.map(record => {
    const termGrades = record.grades[year]?.[term] || {
      behavior: 5,
      applications: 5,
      notebook: 5,
      assignment: 0,
      exam: 0
    }
    
    return {
      id: record.id,
      classId: record.classId,
      lastName: record.lastName,
      firstName: record.firstName,
      dateOfBirth: record.dateOfBirth,
      specialCase: record.specialCase,
      ...termGrades
    }
  })
}

/**
 * Grades Store
 * 
 * Manages student grade data and classes with localStorage persistence.
 * Supports Academic Years and Terms.
 */
export const useGradesStore = create<GradesStore>()(
  devtools(
    persist(
      (set, get) => ({
        classes: [],
        studentRecords: [],
        students: [], // Computed view
        selectedClassId: null,
        selectedYear: DEFAULT_YEAR,
        selectedTerm: 1,

        setSelectedClass: (classId) =>
          set(
            { selectedClassId: classId },
            false,
            'grades/setSelectedClass'
          ),

        setYear: (year) => 
          set(state => ({ 
            selectedYear: year,
            students: projectStudents(state.studentRecords, year, state.selectedTerm)
          }), false, 'grades/setYear'),

        setTerm: (term) => 
          set(state => ({ 
            selectedTerm: term,
            students: projectStudents(state.studentRecords, state.selectedYear, term)
          }), false, 'grades/setTerm'),

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
            (state) => {
              const newRecords: StudentData[] = studentsData.map((s) => ({
                id: s.id || crypto.randomUUID(),
                classId,
                lastName: s.lastName,
                firstName: s.firstName,
                dateOfBirth: s.dateOfBirth,
                specialCase: s.specialCase,
                grades: {
                  [state.selectedYear]: {
                    [state.selectedTerm]: {
                      behavior: s.behavior ?? 5,
                      applications: s.applications ?? 5,
                      notebook: s.notebook ?? 5,
                      assignment: s.assignment ?? 0,
                      exam: s.exam ?? 0,
                    }
                  }
                }
              }))

              const updatedRecords = [...state.studentRecords, ...newRecords]
              
              return {
                studentRecords: updatedRecords,
                students: projectStudents(updatedRecords, state.selectedYear, state.selectedTerm)
              }
            },
            false,
            'grades/addStudentsToClass'
          ),

        removeClass: (classId) =>
          set(
            (state) => {
              const newClasses = state.classes.filter((c) => c.id !== classId)
              const newRecords = state.studentRecords.filter((s) => s.classId !== classId)
              return {
                classes: newClasses,
                studentRecords: newRecords,
                students: projectStudents(newRecords, state.selectedYear, state.selectedTerm),
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
            (state) => {
              // Update master record
              const newRecords = state.studentRecords.map((record) => {
                if (record.id !== id) return record

                // If updating profile fields
                const updatedRecord = { ...record, ...updates }
                
                // If updating grade fields, merge into current term
                // Check if any grade fields are present in updates
                const gradeFields: (keyof TermGrades)[] = ['behavior', 'applications', 'notebook', 'assignment', 'exam']
                const hasGradeUpdates = gradeFields.some(f => f in updates)

                if (hasGradeUpdates) {
                  const currentYearGrades = updatedRecord.grades[state.selectedYear] || {}
                  const currentTermGrades = currentYearGrades[state.selectedTerm] || {
                    behavior: 5, applications: 5, notebook: 5, assignment: 0, exam: 0
                  }

                  updatedRecord.grades = {
                    ...updatedRecord.grades,
                    [state.selectedYear]: {
                      ...currentYearGrades,
                      [state.selectedTerm]: {
                        ...currentTermGrades,
                        behavior: (updates.behavior !== undefined) ? updates.behavior : currentTermGrades.behavior,
                        applications: (updates.applications !== undefined) ? updates.applications : currentTermGrades.applications,
                        notebook: (updates.notebook !== undefined) ? updates.notebook : currentTermGrades.notebook,
                        assignment: (updates.assignment !== undefined) ? updates.assignment : currentTermGrades.assignment,
                        exam: (updates.exam !== undefined) ? updates.exam : currentTermGrades.exam,
                      }
                    }
                  }
                }

                // Clean up flat properties from record if they leaked in (updates comes from StudentGrade)
                const recordAsMutable = updatedRecord as StudentData & Record<string, unknown>
                delete recordAsMutable.behavior
                delete recordAsMutable.applications
                delete recordAsMutable.notebook
                delete recordAsMutable.assignment
                delete recordAsMutable.exam
                return recordAsMutable as StudentData
              })

              return {
                studentRecords: newRecords,
                students: projectStudents(newRecords, state.selectedYear, state.selectedTerm)
              }
            },
            false,
            'grades/updateStudent'
          ),

        updateStudentField: (id, field, value) => {
           // Reuse updateStudent for simplicity as it handles logic
           get().updateStudent(id, { [field]: value })
        },

        reorderStudents: (classId, orderedIds) =>
          set(
            (state) => {
              // Reordering affects the master list order
              const classRecords = state.studentRecords.filter(s => s.classId === classId)
              const otherRecords = state.studentRecords.filter(s => s.classId !== classId)
              
              const reorderedClassRecords = orderedIds
                .map(id => classRecords.find(s => s.id === id))
                .filter((s): s is StudentData => s !== undefined)
              
              const newRecords = [...otherRecords, ...reorderedClassRecords]

              return {
                studentRecords: newRecords,
                students: projectStudents(newRecords, state.selectedYear, state.selectedTerm)
              }
            },
            false,
            'grades/reorderStudents'
          ),

        getStudent: (id) => {
          return get().students.find((s) => s.id === id)
        },

        getStudentsByClass: (classId) => {
          return get().students.filter((s) => s.classId === classId)
        },

        clearAllData: () =>
          set(
            { classes: [], studentRecords: [], students: [], selectedClassId: null },
            false,
            'grades/clearAllData'
          ),
      }),
      {
        name: 'school-admin-grades',
        version: 1, // Increment version for migration
        migrate: (persistedState: unknown, version: number): GradesStore => {
          if (version === 0) {
            // Migration from v0 (flat students) to v1 (nested studentRecords)
            const state = persistedState as Partial<GradesStore>
            const oldStudents = (state?.students || []) as StudentGrade[]
            const newRecords: StudentData[] = oldStudents.map((s: StudentGrade) => ({
              id: s.id,
              classId: s.classId,
              lastName: s.lastName,
              firstName: s.firstName,
              dateOfBirth: s.dateOfBirth,
              specialCase: s.specialCase,
              grades: {
                [DEFAULT_YEAR]: {
                  1: {
                    behavior: s.behavior ?? 5,
                    applications: s.applications ?? 5,
                    notebook: s.notebook ?? 5,
                    assignment: s.assignment ?? 0,
                    exam: s.exam ?? 0,
                  }
                }
              }
            }))

            return {
              ...state,
              studentRecords: newRecords,
              students: projectStudents(newRecords, DEFAULT_YEAR, 1), // Hydrate view
              selectedYear: DEFAULT_YEAR,
              selectedTerm: 1,
            } as GradesStore
          }
          return persistedState as GradesStore
        },
      }
    ),
    { name: 'GradesStore' }
  )
)

export const useStudents = () => useGradesStore((state) => state.students)
export const useClasses = () => useGradesStore((state) => state.classes)
export const useSelectedClass = () => useGradesStore((state) => state.selectedClassId)
