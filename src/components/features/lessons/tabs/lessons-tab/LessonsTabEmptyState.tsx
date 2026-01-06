import { useTranslation } from 'react-i18next'
import { BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface LessonsTabEmptyStateProps {
    hasSearchQuery: boolean
}

export function LessonsTabEmptyState({ hasSearchQuery }: LessonsTabEmptyStateProps) {
    const { t } = useTranslation()

    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">
                    {hasSearchQuery
                        ? t('lessons.noSearchResults', 'No lessons found')
                        : t('lessons.noReadyLessons', 'No ready lessons in the library')}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                    {hasSearchQuery
                        ? t('lessons.tryDifferentSearch', 'Try a different search term')
                        : t(
                            'lessons.markReadyTip',
                            'Create a preparation and mark it as "Ready" to see it here.'
                        )}
                </p>
            </CardContent>
        </Card>
    )
}
