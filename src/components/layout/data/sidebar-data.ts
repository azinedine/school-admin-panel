import {
  LayoutDashboard,
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

// Translation keys for sidebar items
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
      title: 'nav.mainMenu',
      items: [
        {
          title: 'nav.overview',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'nav.classPreparation',
          url: '/prep',
          icon: ClipboardCheck,
        },
        {
          title: 'nav.attendance',
          url: '/attendance',
          icon: FileText,
        },
        {
          title: 'nav.exams',
          url: '/exams',
          icon: BookOpen,
        },
        {
          title: 'nav.assignmentManagement',
          url: '/assignments',
          icon: FileText,
        },
        {
          title: 'nav.schedule',
          url: '/schedule',
          icon: Calendar,
        },
        {
          title: 'nav.grades.title',
          url: '/grades',
          icon: GraduationCap,
          items: [
            {
              title: 'nav.grades.class4a',
              url: '/grades?class=class-4a',
            },
            {
              title: 'nav.grades.class4b',
              url: '/grades?class=class-4b',
            },
            {
              title: 'nav.grades.class5a',
              url: '/grades?class=class-5a',
            },
          ],
        },
        {
          title: 'nav.messages',
          url: '/messages',
          icon: MessageSquare,
          badge: '2',
        },
        {
          title: 'nav.analytics',
          url: '/analytics',
          icon: BarChart3,
        },
        {
          title: 'nav.reports',
          url: '/reports',
          icon: Files,
        },
      ],
    },
    {
      title: 'nav.settingsAndNews',
      items: [
        {
          title: 'nav.schoolNews',
          url: '/news',
          icon: Newspaper,
        },
        {
          title: 'nav.schoolActivities',
          url: '/activities',
          icon: Activity,
        },
        {
          title: 'nav.whatsNew',
          url: '/updates',
          icon: Zap,
        },
        {
          title: 'nav.settings',
          url: '/settings',
          icon: Settings,
        },
      ],
    },
  ],
}
