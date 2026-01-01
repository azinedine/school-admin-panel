import { format } from 'date-fns'
import {
    BookOpen,
    Clock,
    MoreVertical,
    Pencil,
    Trash2,
    CheckCircle2,
    CircleDashed,
    FileText,
    Send
} from 'lucide-react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import { cn } from '@/lib/utils'

interface PreparationCardProps {
    prep: LessonPreparation
    onView: (prep: LessonPreparation) => void
    onViewMemo?: (prep: LessonPreparation) => void
    onEdit?: (prep: LessonPreparation) => void
    onDelete?: (prep: LessonPreparation) => void
    onStatusChange?: (prep: LessonPreparation, status: 'draft' | 'ready' | 'delivered') => void
    readOnly?: boolean
}

const statusConfig = {
    draft: {
        label: 'Draft',
        className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200',
        icon: CircleDashed,
    },
    ready: {
        label: 'Ready',
        className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
        icon: CheckCircle2,
    },
    delivered: {
        label: 'Delivered',
        className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200',
        icon: Send,
    },
} as const

export function PreparationCard({ prep, onView, onViewMemo, onEdit, onDelete, onStatusChange }: PreparationCardProps) {
    const status = statusConfig[prep.status]
    const StatusIcon = status.icon

    return (
        <Card
            className="group relative flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary/20 cursor-pointer overflow-hidden border-border/60 bg-card"
            onClick={() => onView(prep)}
        >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary/80 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />

            <CardHeader className="p-4 pb-2 space-y-3">
                <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                            <Badge variant="outline" className="font-mono bg-background/50 px-1.5 h-5">
                                #{prep.lesson_number}
                            </Badge>
                            <Badge variant="outline" className={cn('px-2 py-0.5 h-5 flex gap-1 items-center border', status.className)}>
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                            </Badge>
                        </div>
                        <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                            {prep.knowledge_resource}
                        </h3>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100">
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
                                            <DropdownMenuItem onClick={() => onStatusChange(prep, 'delivered')}>
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
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-muted/40 p-2 rounded-md border border-border/50">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Domain</p>
                        <p className="text-xs font-medium truncate" title={prep.domain}>{prep.domain}</p>
                    </div>
                    <div className="bg-muted/40 p-2 rounded-md border border-border/50">
                        <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-0.5">Unit</p>
                        <p className="text-xs font-medium truncate" title={prep.learning_unit}>{prep.learning_unit}</p>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-1 flex-1">
                {/* Counts Badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 border-blue-100 dark:border-blue-900/30">
                        {prep.learning_objectives?.length || 0} Objectives
                    </Badge>
                    <Badge variant="secondary" className="px-1.5 py-0 h-5 text-[10px] bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/30">
                        {prep.teaching_methods?.length || 0} Methods
                    </Badge>
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-2 mt-auto border-t bg-muted/20 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px] font-medium" title={prep.level}>{prep.level}</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{prep.duration_minutes}m</span>
                    </div>
                    <div className="font-medium text-foreground/80">
                        {format(new Date(prep.date), 'MMM d')}
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
