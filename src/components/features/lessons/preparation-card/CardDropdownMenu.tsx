import {
    BookOpen,
    MoreVertical,
    Pencil,
    Trash2,
    CheckCircle2,
    CircleDashed,
    FileText,
    Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { statusConfig } from './CardStatusBadge'

interface CardDropdownMenuProps {
    prep: LessonPreparation
    onView: (prep: LessonPreparation) => void
    onViewMemo?: (prep: LessonPreparation) => void
    onEdit?: (prep: LessonPreparation) => void
    onDelete?: (prep: LessonPreparation) => void
    onStatusChange?: (
        prep: LessonPreparation,
        status: 'draft' | 'ready' | 'delivered'
    ) => void
}

export function CardDropdownMenu({
    prep,
    onView,
    onViewMemo,
    onEdit,
    onDelete,
    onStatusChange,
}: CardDropdownMenuProps) {
    const StatusIcon = statusConfig[prep.status].icon

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => onView(prep)}>
                        <FileText className="mr-2 h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    {onViewMemo && (
                        <DropdownMenuItem onClick={() => onViewMemo(prep)}>
                            <BookOpen className="mr-2 h-4 w-4" /> View Memo
                        </DropdownMenuItem>
                    )}
                    {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(prep)}>
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                    )}
                    {onStatusChange && (
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <StatusIcon className="mr-2 h-4 w-4" /> Change Status
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuItem onClick={() => onStatusChange(prep, 'draft')}>
                                    <CircleDashed className="mr-2 h-4 w-4" /> Draft
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => onStatusChange(prep, 'ready')}>
                                    <CheckCircle2 className="mr-2 h-4 w-4" /> Ready
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => onStatusChange(prep, 'delivered')}
                                >
                                    <Send className="mr-2 h-4 w-4" /> Delivered
                                </DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    )}
                    {onDelete && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => onDelete(prep)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
