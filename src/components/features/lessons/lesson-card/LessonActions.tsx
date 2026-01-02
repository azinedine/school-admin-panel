import { MoreVertical, Eye, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Lesson } from '@/schemas/lesson'
import type { TFunction } from 'i18next'

interface LessonActionsProps {
    lesson: Lesson
    onView?: (lesson: Lesson) => void
    onEdit?: (lesson: Lesson) => void
    onDelete?: (lesson: Lesson) => void
    t: TFunction
}

/**
 * Single Responsibility: Only handles action dropdown
 */
export function LessonActions({
    lesson,
    onView,
    onEdit,
    onDelete,
    t,
}: LessonActionsProps) {
    if (!onView && !onEdit && !onDelete) {
        return null
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {onView && (
                    <DropdownMenuItem onClick={() => onView(lesson)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {t('common.view', 'View')}
                    </DropdownMenuItem>
                )}
                {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(lesson)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        {t('common.edit', 'Edit')}
                    </DropdownMenuItem>
                )}
                {onDelete && (
                    <DropdownMenuItem
                        onClick={() => onDelete(lesson)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('common.delete', 'Delete')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
