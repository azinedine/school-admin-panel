import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2, Search, BookOpen, Library } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog'
import { useLessonPreps } from '@/hooks/use-lesson-preparation'
// import { PreparationCard } from '@/components/lessons_compponents/PreparationCard'
import { LessonPrepDetails } from './LessonPrepDetails'
import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { PreparationCard } from './PreparationCard'

/**
 * LessonsTab (Library) - View Ready Lesson Preparations
 * Connects to the Preparation module by displaying only "ready" items.
 */
export const LessonsTab = memo(function LessonsTab() {
    const { t } = useTranslation()

    // Query for READY preparations only
    const { data: readyPreps = [], isLoading } = useLessonPreps({ status: 'ready' })

    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [selectedPrep, setSelectedPrep] = useState<LessonPreparation | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Client-side search filtering
    const filteredPreps = readyPreps.filter((prep) => {
        const query = searchQuery.toLowerCase()
        return (
            prep.lesson_number.toLowerCase().includes(query) ||
            (prep.level && prep.level.toLowerCase().includes(query)) ||
            (prep.subject && prep.subject.toLowerCase().includes(query))
        )
    })

    const handleView = (prep: LessonPreparation) => {
        setSelectedPrep(prep)
        setViewDialogOpen(true)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Library className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">
                            {t('lessons.library', 'Lesson Library')}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {t('lessons.librarySubtitle', 'Browse ready-to-teach lessons')}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={t('common.search', 'Search library...')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>
            </div>

            {/* Library Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : filteredPreps.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">
                            {searchQuery
                                ? t('lessons.noSearchResults', 'No lessons found')
                                : t('lessons.noReadyLessons', 'No ready lessons in the library')}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                            {searchQuery
                                ? t('lessons.tryDifferentSearch', 'Try a different search term')
                                : t('lessons.markReadyTip', 'Create a preparation and mark it as "Ready" to see it here.')}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredPreps.map((prep) => (
                        <PreparationCard
                            key={prep.id}
                            prep={prep}
                            onView={handleView}
                            readOnly={true}
                        />
                    ))}
                </div>
            )}

            {/* View Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="text-xl">{selectedPrep?.lesson_number}</span>
                        </DialogTitle>
                        <DialogDescription>
                            {t('lessons.viewDetails', 'View lesson details')}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="mt-4">
                        {selectedPrep && <LessonPrepDetails data={selectedPrep} />}
                        <div className="flex justify-end pt-4 border-t mt-6">
                            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                {t('common.close', 'Close')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
})
