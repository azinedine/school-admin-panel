import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { createIndexedDBStorage } from './storage'

/**
 * Student Grade Type
 */
export interface StudentGrade {
  id: string
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
  students: StudentGrade[]
  initialized: boolean
}

/**
 * Grades Store Actions
 */
interface GradesActions {
  initializeStudents: (students: StudentGrade[]) => void
  updateStudent: (id: string, updates: Partial<StudentGrade>) => void
  updateStudentField: (id: string, field: keyof StudentGrade, value: number) => void
  getStudent: (id: string) => StudentGrade | undefined
}

type GradesStore = GradesState & GradesActions

/**
 * Pre-configured IndexedDB storage for grades
 */
const gradesStorage = createIndexedDBStorage('school-admin-db', 'grades-store')

/**
 * Initial student data
 */
const initialStudentsData: StudentGrade[] = [
  { id: "1101344040220100", lastName: "أوهمنة", firstName: "أروى", dateOfBirth: "2013-06-27", behavior: 20, applications: 20, notebook: 20, assignment: 18.5, exam: 18 },
  { id: "1001344040411100", lastName: "إليفي", firstName: "لؤي عبد الجليل", dateOfBirth: "2013-10-20", behavior: 20, applications: 20, notebook: 20, assignment: 16.5, exam: 16 },
  { id: "1101444010251200", lastName: "اسعيدي", firstName: "مارية", dateOfBirth: "2014-05-07", behavior: 20, applications: 20, notebook: 20, assignment: 18, exam: 18 },
  { id: "1101344040411100", lastName: "بلهواري", firstName: "أروى", dateOfBirth: "2013-10-20", behavior: 20, applications: 20, notebook: 20, assignment: 17, exam: 16.5 },
  { id: "1001444040061100", lastName: "بن دنون", firstName: "آدم", dateOfBirth: "2014-01-11", behavior: 20, applications: 20, notebook: 18, assignment: 13, exam: 12.5 },
  { id: "1101344040251200", lastName: "بن رجدال", firstName: "إكرام", dateOfBirth: "2013-05-07", behavior: 20, applications: 20, notebook: 20, assignment: 18, exam: 17 },
  { id: "1001444120311100", lastName: "بن عدودة", firstName: "عصام الدين", dateOfBirth: "2014-06-16", behavior: 20, applications: 18, notebook: 18, assignment: 14, exam: 11 },
  { id: "1001444010081200", lastName: "توري", firstName: "ماهر", dateOfBirth: "2014-01-18", behavior: 20, applications: 20, notebook: 20, assignment: 14.5, exam: 13 },
  { id: "1101344040251100", lastName: "جبايلي", firstName: "آية", dateOfBirth: "2013-05-05", behavior: 20, applications: 20, notebook: 20, assignment: 17, exam: 17.5 },
  { id: "1101344040241100", lastName: "جواهري", firstName: "جنة", dateOfBirth: "2013-04-24", behavior: 20, applications: 20, notebook: 20, assignment: 18, exam: 18 },
  { id: "1001344040111200", lastName: "حجاج", firstName: "يزيد", dateOfBirth: "2013-02-11", behavior: 18, applications: 18, notebook: 18, assignment: 12, exam: 10 },
  { id: "1101244020211100", lastName: "حسناوي", firstName: "رهف", dateOfBirth: "2012-04-10", behavior: 20, applications: 20, notebook: 20, assignment: 16, exam: 16.5 },
  { id: "1001444040161200", lastName: "حصباوي", firstName: "نضال", dateOfBirth: "2014-03-16", behavior: 20, applications: 20, notebook: 18, assignment: 10, exam: 9 },
  { id: "1101344040091100", lastName: "دقيش", firstName: "يارة", dateOfBirth: "2013-01-19", behavior: 20, applications: 20, notebook: 20, assignment: 16, exam: 15 },
  { id: "1001244040171100", lastName: "ديدوش", firstName: "وسام", dateOfBirth: "2012-03-17", behavior: 18, applications: 18, notebook: 18, assignment: 10, exam: 8 },
  { id: "1101344040241200", lastName: "رحماني", firstName: "ميسم", dateOfBirth: "2013-04-24", behavior: 18, applications: 18, notebook: 16, assignment: 12, exam: 11 },
  { id: "1101444040031200", lastName: "زقدان", firstName: "فرح", dateOfBirth: "2014-01-03", behavior: 20, applications: 20, notebook: 18, assignment: 15, exam: 14 },
  { id: "1101544020231200", lastName: "ساحلي", firstName: "نور اليقين", dateOfBirth: "2015-04-23", behavior: 20, applications: 18, notebook: 16, assignment: 10, exam: 9 },
  { id: "1001444040301200", lastName: "سريدي", firstName: "أيمن", dateOfBirth: "2014-06-15", behavior: 18, applications: 16, notebook: 14, assignment: 8, exam: 6 },
  { id: "1101344040121200", lastName: "شابي", firstName: "أسيل", dateOfBirth: "2013-02-12", behavior: 20, applications: 20, notebook: 20, assignment: 17, exam: 17 },
  { id: "1101444010051200", lastName: "شارف", firstName: "آية الرحمان", dateOfBirth: "2014-01-10", behavior: 18, applications: 18, notebook: 16, assignment: 11, exam: 10 },
  { id: "1001344040111100", lastName: "شريف", firstName: "أيوب", dateOfBirth: "2013-02-11", behavior: 18, applications: 16, notebook: 14, assignment: 7, exam: 5 },
  { id: "1001444040091200", lastName: "طالب", firstName: "عماد الدين", dateOfBirth: "2014-01-19", behavior: 20, applications: 20, notebook: 20, assignment: 17, exam: 16 },
  { id: "1001444040111100", lastName: "عثماني", firstName: "صفوان", dateOfBirth: "2014-02-11", behavior: 20, applications: 20, notebook: 18, assignment: 12.5, exam: 11 },
  { id: "1101344040121100", lastName: "فرحي", firstName: "سجى", dateOfBirth: "2013-02-12", behavior: 20, applications: 20, notebook: 20, assignment: 17.5, exam: 18 },
  { id: "1101444040121100", lastName: "قماري", firstName: "عائشة", dateOfBirth: "2014-02-12", behavior: 20, applications: 20, notebook: 18, assignment: 14, exam: 12 },
  { id: "1001444040151200", lastName: "قواسمية", firstName: "جمال الدين", dateOfBirth: "2014-03-15", behavior: 18, applications: 16, notebook: 14, assignment: 7.5, exam: 6 },
  { id: "1101244010021200", lastName: "كراشي", firstName: "ريتاج", dateOfBirth: "2012-01-05", behavior: 20, applications: 20, notebook: 20, assignment: 18, exam: 18.5 },
  { id: "1001344040121100", lastName: "كسال", firstName: "محمد حمزة", dateOfBirth: "2013-02-12", behavior: 20, applications: 20, notebook: 18, assignment: 14, exam: 13 },
  { id: "1001444040061200", lastName: "لعويسي", firstName: "سفيان", dateOfBirth: "2014-01-11", behavior: 18, applications: 16, notebook: 14, assignment: 6, exam: 5 },
  { id: "1101344040111100", lastName: "ماحي", firstName: "آية", dateOfBirth: "2013-02-11", behavior: 20, applications: 20, notebook: 20, assignment: 17, exam: 17.5 },
  { id: "1101444010041200", lastName: "معتصم", firstName: "رقية", dateOfBirth: "2014-01-09", behavior: 20, applications: 20, notebook: 18, assignment: 13, exam: 12 },
  { id: "1101344040061100", lastName: "منصوري", firstName: "رتاج", dateOfBirth: "2013-01-11", behavior: 20, applications: 20, notebook: 20, assignment: 15.5, exam: 15 },
  { id: "1001344040121200", lastName: "ميهوب", firstName: "عماد الدين", dateOfBirth: "2013-02-12", behavior: 18, applications: 18, notebook: 16, assignment: 10, exam: 9 },
  { id: "1001344040251100", lastName: "ناشف", firstName: "إسلام", dateOfBirth: "2013-05-05", behavior: 18, applications: 16, notebook: 14, assignment: 7, exam: 6 },
  { id: "1101444010281200", lastName: "هلايلي", firstName: "نور الإيمان", dateOfBirth: "2014-05-13", behavior: 20, applications: 20, notebook: 20, assignment: 18, exam: 17.5 },
  { id: "1101444040101200", lastName: "واضح", firstName: "نهاد", dateOfBirth: "2014-02-10", behavior: 20, applications: 20, notebook: 18, assignment: 15, exam: 14.5 },
  { id: "1001444040221200", lastName: "ولهازي", firstName: "محمد رياض", dateOfBirth: "2014-04-22", behavior: 18, applications: 16, notebook: 14, assignment: 8, exam: 7 },
  { id: "1101544020201200", lastName: "يحياوي", firstName: "هاجر", dateOfBirth: "2015-04-10", behavior: 20, applications: 20, notebook: 20, assignment: 16, exam: 16 },
]

/**
 * Grades Store
 * 
 * Manages student grade data with IndexedDB persistence.
 */
export const useGradesStore = create<GradesStore>()(
  devtools(
    persist(
      (set, get) => ({
        students: [],
        initialized: false,

        initializeStudents: (students) =>
          set(
            (state) => {
              // Only initialize if not already initialized
              if (state.initialized && state.students.length > 0) {
                return state
              }
              return {
                students,
                initialized: true,
              }
            },
            false,
            'grades/initializeStudents'
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
      }),
      {
        name: 'grades-data',
        storage: gradesStorage as any,
        onRehydrateStorage: () => (state) => {
          // If no data after rehydration, initialize with default data
          if (state && (!state.students || state.students.length === 0)) {
            state.initializeStudents(initialStudentsData)
          }
        },
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
 * Get initial students data for first-time initialization
 */
export const getInitialStudentsData = () => initialStudentsData
