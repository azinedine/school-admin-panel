import { Link, useLocation } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { BookOpen, FileText, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LessonNavItem {
    path: string
    labelKey: string
    icon: React.ReactNode
}

const navItems: LessonNavItem[] = [
    {
        path: '/teacher/lessons',
        labelKey: 'nav.lessons',
        icon: <Calendar className="h-4 w-4" />,
    },
    {
        path: '/teacher/lessons/add-lesson',
        labelKey: 'nav.addLesson',
        icon: <BookOpen className="h-4 w-4" />,
    },
    {
        path: '/teacher/lessons/preparation',
        labelKey: 'nav.lessonPreparation',
        icon: <FileText className="h-4 w-4" />,
    },
]

export function LessonPageNav() {
    const { t } = useTranslation()
    const location = useLocation()

    return (
        <nav className="flex gap-2 mb-6 border-b pb-4">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path ||
                    (item.path === '/teacher/lessons' && location.pathname === '/teacher/lessons/')

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            isActive
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                    >
                        {item.icon}
                        {t(item.labelKey)}
                    </Link>
                )
            })}
        </nav>
    )
}
