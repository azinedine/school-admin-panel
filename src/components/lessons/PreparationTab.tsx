import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Loader2, Search, Filter, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
import { useAuthStore } from '@/store/auth-store'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useLessonPreps, useCreateLessonPrep, useUpdateLessonPrep, useDeleteLessonPrep } from '@/hooks/use-lesson-preparation'
import { LessonPrepDetails } from './LessonPrepDetails'
import { LessonPrepForm } from './LessonPrepForm'
import { PreparationCard } from './PreparationCard'
import type { LessonPreparation, LessonPreparationApiPayload } from '@/schemas/lesson-preparation'

/**
 * PreparationTab - CRUD Management of lesson preparations
 * Part of unified Lesson Management feature
 */
export const PreparationTab = memo(function PreparationTab() {
    const { t } = useTranslation()
    const user = useAuthStore((state) => state.user)

    console.log(user)

    // State
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

    const [selectedPrep, setSelectedPrep] = useState<LessonPreparation | null>(null)
    const [prepToDelete, setPrepToDelete] = useState<LessonPreparation | null>(null)

    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'ready' | 'delivered'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Queries & Mutations
    const { data: allPreps = [], isLoading } = useLessonPreps()
    const createMutation = useCreateLessonPrep()
    const updateMutation = useUpdateLessonPrep(selectedPrep?.id || 0)
    const deleteMutation = useDeleteLessonPrep()

    // Filter preparations
    const filteredPreps = allPreps.filter((prep) => {
        const matchesStatus = statusFilter === 'all' || prep.status === statusFilter
        const query = searchQuery.toLowerCase()
        const matchesSearch =
            prep.title.toLowerCase().includes(query) ||
            (prep.class && prep.class.toLowerCase().includes(query)) ||
            (prep.subject && prep.subject.toLowerCase().includes(query))
        return matchesStatus && matchesSearch
    })

    // Handlers
    const handleCreate = () => {
        setSelectedPrep(null)
        setFormDialogOpen(true)
    }

    const handleEdit = (prep: LessonPreparation) => {
        setSelectedPrep(prep)
        setFormDialogOpen(true)
    }

    const handleView = (prep: LessonPreparation) => {
        setSelectedPrep(prep)
        setViewDialogOpen(true)
    }

    const handleDeleteClick = (prep: LessonPreparation) => {
        setPrepToDelete(prep)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (prepToDelete) {
            await deleteMutation.mutateAsync(prepToDelete.id)
            setDeleteDialogOpen(false)
            setPrepToDelete(null)
        }
    }

    const handleFormSubmit = async (data: LessonPreparationApiPayload) => {
        if (selectedPrep) {
            await updateMutation.mutateAsync(data)
        } else {
            await createMutation.mutateAsync(data)
        }
        setFormDialogOpen(false)
    }

    const statusCounts = {
        all: allPreps.length,
        draft: allPreps.filter((p) => p.status === 'draft').length,
        ready: allPreps.filter((p) => p.status === 'ready').length,
        delivered: allPreps.filter((p) => p.status === 'delivered').length,
    }

    return (
        <div className="space-y-6">
            {/* Header with Actions & Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{t('lessons.preparations', 'Lesson Preparations')}</h2>
                    <p className="text-muted-foreground">
                        {t('lessons.managePreps', 'Create and manage your lesson plans and teaching materials.')}
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2 shrink-0">
                    <Plus className="h-4 w-4" />
                    {t('lessons.createPrep', 'Create Preparation')}
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={t('common.search', 'Search preparations...')}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-background"
                    />
                </div>
                <Select
                    value={statusFilter}
                    onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}
                >
                    <SelectTrigger className="w-full sm:w-[180px] bg-background">
                        <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">
                            {t('common.all', 'All Status')} <span className="text-muted-foreground ml-1">({statusCounts.all})</span>
                        </SelectItem>
                        <SelectItem value="draft">
                            {t('lessons.status.draft', 'Draft')} <span className="text-muted-foreground ml-1">({statusCounts.draft})</span>
                        </SelectItem>
                        <SelectItem value="ready">
                            {t('lessons.status.ready', 'Ready')} <span className="text-muted-foreground ml-1">({statusCounts.ready})</span>
                        </SelectItem>
                        <SelectItem value="delivered">
                            {t('lessons.status.delivered', 'Delivered')} <span className="text-muted-foreground ml-1">({statusCounts.delivered})</span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Preparations Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredPreps.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="p-4 rounded-full bg-muted/50 mb-4">
                            <BookOpen className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold mb-1">
                            {searchQuery || statusFilter !== 'all'
                                ? t('lessons.noMatchingPreps', 'No preparations match your filters')
                                : t('lessons.noPreparations', 'No lesson preparations yet')}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            {searchQuery || statusFilter !== 'all'
                                ? t('lessons.tryAdjusting', 'Try adjusting your search or filters to find what you looking for.')
                                : t('lessons.startCreating', 'Start by creating your first lesson preparation plan.')}
                        </p>
                        {(searchQuery || statusFilter !== 'all') ? (
                            <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                                {t('common.clearFilters', 'Clear Filters')}
                            </Button>
                        ) : (
                            <Button onClick={handleCreate}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('lessons.createFirst', 'Create First Preparation')}
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredPreps.map((prep) => (
                        <PreparationCard
                            key={prep.id}
                            prep={prep}
                            onView={handleView}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                        />
                    ))}
                </div>
            )}

            {/* View Details Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span className="text-xl">{selectedPrep?.title}</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                        {selectedPrep && <LessonPrepDetails data={selectedPrep} />}
                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                {t('common.close', 'Close')}
                            </Button>
                            <Button onClick={() => { setViewDialogOpen(false); selectedPrep && handleEdit(selectedPrep); }}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('common.edit', 'Edit')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create/Edit Form Dialog */}
            <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
                    <div className="px-6 py-4 border-b">
                        <DialogTitle>
                            {selectedPrep ? t('lessons.editPrep', 'Edit Lesson Preparation') : t('lessons.createPrep', 'New Lesson Preparation')}
                        </DialogTitle>
                    </div>
                    <div className="p-6">
                        <LessonPrepForm
                            initialData={selectedPrep}
                            onSubmit={handleFormSubmit}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                            classes={user?.levels && user.levels.length > 0
                                ? user.levels
                                : ['1AS', '2AS', '3AS', '1AM', '2AM', '3AM', '4AM']}
                            onCancel={() => setFormDialogOpen(false)}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('common.deleteConfirmTitle', 'Are you sure?')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('lessons.deletePrepConfirm', 'This action cannot be undone. This will permanently delete the lesson preparation.')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={confirmDelete}
                        >
                            {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                                <Trash2 className="h-4 w-4 mr-2" />
                            )}
                            {t('common.delete', 'Delete')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
})
