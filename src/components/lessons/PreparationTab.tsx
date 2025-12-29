import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Eye, BookOpen, Loader2, Search, Filter } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { useLessonPreps } from '@/hooks/use-lesson-preparation'
import { LessonPrepDetails } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonPrepDetails'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ar, fr, enUS } from 'date-fns/locale'

/**
 * PreparationTab - Read-only view of lesson preparations
 * Part of unified Lesson Management feature
 */
export const PreparationTab = memo(function PreparationTab() {
    const { t, i18n } = useTranslation()
    const [detailsOpen, setDetailsOpen] = useState(false)
    const [selectedPrep, setSelectedPrep] = useState<LessonPreparation | null>(null)
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'ready' | 'delivered'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    const { data: allPreps = [], isLoading } = useLessonPreps()
    const locale = i18n.language === 'ar' ? ar : i18n.language === 'fr' ? fr : enUS

    // Filter preparations based on status and search
    const filteredPreps = allPreps.filter((prep) => {
        const matchesStatus = statusFilter === 'all' || prep.status === statusFilter
        const query = searchQuery.toLowerCase()
        const matchesSearch =
            prep.title.toLowerCase().includes(query) ||
            prep.class.toLowerCase().includes(query) ||
            prep.subject.toLowerCase().includes(query)
        return matchesStatus && matchesSearch
    })

    const handleView = (prep: LessonPreparation) => {
        setSelectedPrep(prep)
        setDetailsOpen(true)
    }

    const statusConfig = {
        draft: {
            label: t('lessons.status.draft', 'Draft'),
            className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
        },
        ready: {
            label: t('lessons.status.ready', 'Ready'),
            className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        },
        delivered: {
            label: t('lessons.status.delivered', 'Delivered'),
            className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
        },
    }

    const statusCounts = {
        all: allPreps.length,
        draft: allPreps.filter((p) => p.status === 'draft').length,
        ready: allPreps.filter((p) => p.status === 'ready').length,
        delivered: allPreps.filter((p) => p.status === 'delivered').length,
    }

    return (
        <div className="space-y-6">
            {/* Header with Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <BookOpen className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">
                            {t('lessons.preparations', 'Lesson Preparations')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {t('lessons.preparationsSubtitle', '{{count}} preparations (read-only)', {
                                count: allPreps.length,
                            })}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('common.search', 'Search...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
                    >
                        <SelectTrigger className="w-[140px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                {t('common.all', 'All')} ({statusCounts.all})
                            </SelectItem>
                            <SelectItem value="draft">
                                {t('lessons.status.draft', 'Draft')} ({statusCounts.draft})
                            </SelectItem>
                            <SelectItem value="ready">
                                {t('lessons.status.ready', 'Ready')} ({statusCounts.ready})
                            </SelectItem>
                            <SelectItem value="delivered">
                                {t('lessons.status.delivered', 'Delivered')} ({statusCounts.delivered})
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Preparations Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : filteredPreps.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">
                            {t('lessons.noPreparations', 'No lesson preparations')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {searchQuery || statusFilter !== 'all'
                                ? t('lessons.noMatchingPreps', 'No preparations match your filters')
                                : t('lessons.noPreparationsDesc', 'Lesson preparations will appear here')}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredPreps.map((prep) => {
                        const status = statusConfig[prep.status as keyof typeof statusConfig]
                        const formattedDate = format(new Date(prep.date), 'PPP', { locale })

                        return (
                            <Card key={prep.id} className="group transition-all hover:shadow-md">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base truncate" title={prep.title}>
                                                {prep.title}
                                            </CardTitle>
                                        </div>
                                        <Badge className={cn('font-medium shrink-0', status?.className)}>
                                            {status?.label || prep.status}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="pb-4">
                                    {/* Meta Information */}
                                    <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-4">
                                        <div>
                                            <span className="font-medium">{t('lessons.form.class', 'Class')}:</span>{' '}
                                            {prep.class}
                                        </div>
                                        <div>
                                            <span className="font-medium">{t('lessons.form.subject', 'Subject')}:</span>{' '}
                                            {prep.subject}
                                        </div>
                                        <div className="col-span-2">
                                            <span className="font-medium">{t('lessons.form.date', 'Date')}:</span>{' '}
                                            {formattedDate}
                                        </div>
                                    </div>

                                    {/* View Button - Read Only */}
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleView(prep)}
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        {t('common.view', 'View Details')}
                                    </Button>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* View Details Dialog - Read Only */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('lessons.details', 'Lesson Preparation Details')}</DialogTitle>
                    </DialogHeader>
                    {selectedPrep && <LessonPrepDetails data={selectedPrep} />}
                </DialogContent>
            </Dialog>
        </div>
    )
})
