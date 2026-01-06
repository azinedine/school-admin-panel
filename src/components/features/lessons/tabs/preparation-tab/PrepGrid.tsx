import { Loader2, BookOpen, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { PreparationCard } from '@/components/features/lessons'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import type { TFunction } from 'i18next'

interface PrepGridProps {
    t: TFunction
    isLoading: boolean
    preps: LessonPreparation[]
    hasFilters: boolean
    onView: (prep: LessonPreparation) => void
    onViewMemo: (prep: LessonPreparation) => void
    onEdit: (prep: LessonPreparation) => void
    onDelete: (prep: LessonPreparation) => void
    onStatusChange: (prep: LessonPreparation, status: 'draft' | 'ready' | 'delivered') => void
    onCreate: () => void
    onClearFilters: () => void
}

/**
 * Single Responsibility: Grid display of preparation cards with empty states
 */
export function PrepGrid({
    t,
    isLoading,
    preps,
    hasFilters,
    onView,
    onViewMemo,
    onEdit,
    onDelete,
    onStatusChange,
    onCreate,
    onClearFilters,
}: PrepGridProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (preps.length === 0) {
        return (
            <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="p-4 rounded-full bg-muted/50 mb-4">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-1">
                        {hasFilters
                            ? t('pages.prep.noMatchingPreps', 'No preparations match your filters')
                            : t('pages.prep.noPreparations', 'No lesson preparations yet')}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6">
                        {hasFilters
                            ? t(
                                'pages.prep.tryAdjusting',
                                'Try adjusting your search or filters to find what you looking for.'
                            )
                            : t(
                                'pages.prep.startCreating',
                                'Start by creating your first lesson preparation plan.'
                            )}
                    </p>
                    {hasFilters ? (
                        <Button variant="outline" onClick={onClearFilters}>
                            {t('common.clearFilters', 'Clear Filters')}
                        </Button>
                    ) : (
                        <Button onClick={onCreate}>
                            <Plus className="h-4 w-4 mr-2" />
                            {t('pages.prep.createFirst', 'Create First Preparation')}
                        </Button>
                    )}
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {preps.map((prep) => (
                <PreparationCard
                    key={prep.id}
                    prep={prep}
                    onView={onView}
                    onViewMemo={onViewMemo}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                />
            ))}
        </div>
    )
}
