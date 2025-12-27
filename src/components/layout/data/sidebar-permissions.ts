import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  MessageSquare,
  FileText,
  Settings,
  Megaphone,
  CreditCard,
  ClipboardList,
  GraduationCap,
  Shield,
  Database,
  Lock as LockIcon,
  History as HistoryIcon,
  BarChart3,
  Files
} from 'lucide-react'
import type { NavGroup } from '../types'

export const PARENT_SIDEBAR: NavGroup[] = [
  {
    title: 'nav.mainMenu',
    items: [
      {
        title: 'nav.dashboard',
        url: '/parent/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'nav.profile',
        url: '/parent/profile',
        icon: Users,
      },
      {
        title: 'nav.children',
        url: '/parent/children',
        icon: Users,
      },
      {
        title: 'nav.grades',
        url: '/parent/grades',
        icon: GraduationCap,
      },
      {
        title: 'nav.attendance',
        url: '/parent/attendance',
        icon: FileText,
      },
      {
        title: 'nav.timetable',
        url: '/parent/timetable',
        icon: Calendar,
      },
      {
        title: 'nav.announcements',
        url: '/parent/announcements',
        icon: Megaphone,
      },
      {
        title: 'nav.messages',
        url: '/parent/messages',
        icon: MessageSquare,
      },
      {
        title: 'nav.payments',
        url: '/parent/payments',
        icon: CreditCard,
      },
      {
        title: 'nav.settings',
        url: '/parent/settings',
        icon: Settings,
      },
    ],
  },
]

export const STUDENT_SIDEBAR: NavGroup[] = [
  {
    title: 'nav.mainMenu',
    items: [
      {
        title: 'nav.dashboard',
        url: '/student/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'nav.profile',
        url: '/student/profile',
        icon: Users,
      },
      {
        title: 'nav.grades',
        url: '/student/grades',
        icon: GraduationCap,
      },
      {
        title: 'nav.timetable',
        url: '/student/timetable',
        icon: Calendar,
      },
      {
        title: 'nav.attendance',
        url: '/student/attendance',
        icon: FileText,
      },
      {
        title: 'nav.homework',
        url: '/student/homework',
        icon: ClipboardList,
      },
      {
        title: 'nav.exams',
        url: '/student/exams',
        icon: BookOpen,
      },
      {
        title: 'nav.announcements',
        url: '/student/announcements',
        icon: Megaphone,
      },
      {
        title: 'nav.messages',
        url: '/student/messages',
        icon: MessageSquare,
      },
      {
        title: 'nav.settings',
        url: '/student/settings',
        icon: Settings,
      },
    ],
  },
]

export const TEACHER_SIDEBAR: NavGroup[] = [
  {
    title: 'nav.mainMenu',
    items: [
      {
        title: 'nav.dashboard',
        url: '/teacher/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'nav.profile',
        url: '/teacher/profile',
        icon: Users,
      },
      {
        title: 'nav.classes',
        url: '/teacher/classes',
        icon: BookOpen,
      },
      {
        title: 'nav.students',
        url: '/teacher/students',
        icon: Users,
      },
      {
        title: 'nav.attendance',
        url: '/teacher/attendance',
        icon: FileText,
      },
      {
        title: 'nav.grades',
        url: '/teacher/grades',
        icon: GraduationCap,
      },
      {
        title: 'nav.homework',
        url: '/teacher/homework',
        icon: ClipboardList,
      },
      {
        title: 'nav.exams',
        url: '/teacher/exams',
        icon: BookOpen,
      },
      {
        title: 'nav.lessons',
        icon: BookOpen,
        items: [
          {
            title: 'nav.lessonPreparation',
            url: '/teacher/lessons/preparation',
          },
          {
            title: 'nav.addLesson',
            url: '/teacher/lessons/add',
          },
        ]
      },
      {
        title: 'nav.announcements',
        url: '/teacher/announcements',
        icon: Megaphone,
      },
      {
        title: 'nav.messages',
        url: '/teacher/messages',
        icon: MessageSquare,
      },
      {
        title: 'nav.reports',
        url: '/teacher/reports',
        icon: Files,
      },
      {
        title: 'nav.settings',
        url: '/teacher/settings',
        icon: Settings,
      },
    ],
  },
]

export const ADMIN_SIDEBAR: NavGroup[] = [
  {
    title: 'nav.mainMenu',
    items: [
      {
        title: 'nav.dashboard',
        url: '/admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'nav.users',
        url: '/admin/users',
        icon: Users,
      },
      {
        title: 'nav.profile',
        url: '/admin/profile',
        icon: Users,
      },
      {
        title: 'nav.classes',
        url: '/admin/classes',
        icon: BookOpen,
      },
      {
        title: 'nav.timetables',
        url: '/admin/timetables',
        icon: Calendar,
      },
      {
        title: 'nav.attendance',
        url: '/admin/attendance',
        icon: FileText,
      },

      {
        title: 'nav.announcements',
        url: '/admin/announcements',
        icon: Megaphone,
      },
      {
        title: 'nav.payments',
        url: '/admin/payments',
        icon: CreditCard,
      },
      {
        title: 'nav.reports',
        url: '/admin/reports',
        icon: Files,
      },
      {
        title: 'nav.messages',
        url: '/admin/messages',
        icon: MessageSquare,
      },
      {
        title: 'nav.settings',
        url: '/admin/settings',
        icon: Settings,
      },
    ],
  },
]

export const SUPER_ADMIN_SIDEBAR: NavGroup[] = [
  {
    title: 'nav.mainMenu',
    items: [
      {
        title: 'nav.dashboard',
        url: '/super-admin/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'nav.users',
        url: '/super-admin/users',
        icon: Users,
      },
      {
        title: 'nav.profile',
        url: '/super-admin/profile',
        icon: Users,
      },
      {
        title: 'nav.roles',
        url: '/super-admin/roles',
        icon: Shield,
      },
      {
        title: 'nav.admins',
        url: '/super-admin/admins',
        icon: Users,
      },
      {
        title: 'nav.institutions',
        url: '/super-admin/institutions',
        icon: BookOpen,
      },
      {
        title: 'nav.settings',
        url: '/super-admin/settings',
        icon: Settings,
      },
      {
        title: 'nav.api',
        url: '/super-admin/api',
        icon: Database,
      },
      {
        title: 'nav.logs',
        url: '/super-admin/logs',
        icon: HistoryIcon,
      },
      {
        title: 'nav.security',
        url: '/super-admin/security',
        icon: LockIcon,
      },
      {
        title: 'nav.backups',
        url: '/super-admin/backups',
        icon: Database,
      },
      {
        title: 'nav.reports',
        url: '/super-admin/reports',
        icon: BarChart3,
      },
    ],
  },
]
