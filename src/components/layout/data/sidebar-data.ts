import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  BookOpen,
  Calendar,
  MessageSquare,
  BarChart3,
  Files,
  Newspaper,
  Activity,
  Zap,
  Settings,
  GraduationCap,
  FileText,
} from 'lucide-react'

export const sidebarData = {
  user: {
    name: 'Amirbaqian',
    email: 'teacher@mirsad.edu',
    avatar: 'https://github.com/shadcn.png',
  },
  teams: [
    {
      name: 'Mirsad School',
      logo: LayoutDashboard,
      plan: 'Education Management',
    },
  ],
  navGroups: [
    {
      title: 'Main menu',
      items: [
        {
          title: 'Overview',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Class Preparation',
          url: '/prep',
          icon: ClipboardCheck,
        },
        {
          title: 'Attendance',
          url: '/attendance',
          icon: FileText,
        },
        {
          title: 'Exams',
          url: '/exams',
          icon: BookOpen,
        },
        {
          title: 'Assignment management',
          url: '/assignments',
          icon: FileText,
        },
        {
          title: 'Schedule',
          url: '/schedule',
          icon: Calendar,
        },
        {
          title: 'Students',
          url: '/students',
          icon: Users,
        },
        {
          title: 'Grades',
          url: '/grades',
          icon: GraduationCap,
        },
        {
          title: 'Messages',
          url: '/messages',
          icon: MessageSquare,
          badge: '2',
        },
        {
          title: 'Analytics',
          url: '/analytics',
          icon: BarChart3,
        },
        {
          title: 'Reports',
          url: '/reports',
          icon: Files,
        },
      ],
    },
    {
      title: 'Settings and news',
      items: [
        {
          title: 'School News',
          url: '/news',
          icon: Newspaper,
        },
        {
          title: 'School Activities',
          url: '/activities',
          icon: Activity,
        },
        {
          title: "What's New",
          url: '/updates',
          icon: Zap,
        },
        {
          title: 'Settings',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
