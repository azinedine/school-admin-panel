import { useState, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, Loader2, Search, Filter, Plus, Trash2, X, Printer } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
    DialogClose,
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
import { useLessonPreps, useCreateLessonPrep, useUpdateLessonPrep, useDeleteLessonPrep, useGenericUpdateLessonPrep } from '@/hooks/use-lesson-preparation'
import { LessonPrepDetails } from './LessonPrepDetails'
import { LessonPrepForm } from './LessonPrepForm'
import { PreparationCard } from './PreparationCard'
import { FormLanguageSelector } from '@/components/FormLanguageSelector'
import type { LessonPreparation, LessonPreparationApiPayload } from '@/schemas/lesson-preparation'

import { useSubjects, useLevels } from '@/hooks/use-subjects'

/**
 * PreparationTab - CRUD Management of lesson preparations
 * Part of unified Lesson Management feature
 */
export const PreparationTab = memo(function PreparationTab() {
    const { t, i18n } = useTranslation()
    const user = useAuthStore((state) => state.user)

    // State
    const [viewDialogOpen, setViewDialogOpen] = useState(false)
    const [formDialogOpen, setFormDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [formLanguage, setFormLanguage] = useState(i18n.language)

    const [selectedPrep, setSelectedPrep] = useState<LessonPreparation | null>(null)
    const [prepToDelete, setPrepToDelete] = useState<LessonPreparation | null>(null)

    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'ready' | 'delivered'>('all')
    const [searchQuery, setSearchQuery] = useState('')

    // Queries & Mutations
    const { data: allPreps = [], isLoading } = useLessonPreps()
    const { data: subjectsList = [] } = useSubjects()
    const { data: levelsList = [] } = useLevels()
    const createMutation = useCreateLessonPrep()
    const updateMutation = useUpdateLessonPrep(selectedPrep?.id || 0)
    const genericUpdateMutation = useGenericUpdateLessonPrep()
    const deleteMutation = useDeleteLessonPrep()

    // Get teacher's subjects - use freshly fetched subjects filtered by user's assigned subject names
    const isRTL = i18n.language === 'ar'
    const teacherSubjects = subjectsList
        .filter(s => user?.subjects?.includes(s.name) || user?.subjects?.includes(s.name_ar))
        .map(s => isRTL ? s.name_ar : s.name)

    // Get teacher's levels - use user's levels if available, otherwise use all levels
    const teacherLevels = user?.levels?.length
        ? user.levels
        : levelsList.map(l => l.name)

    // Filter preparations
    const filteredPreps = allPreps.filter((prep) => {
        const matchesStatus = statusFilter === 'all' || prep.status === statusFilter
        const query = searchQuery.toLowerCase()
        const matchesSearch =
            (prep.lesson_number && prep.lesson_number.toLowerCase().includes(query)) ||
            (prep.level && prep.level.toLowerCase().includes(query)) ||
            (prep.subject && prep.subject.toLowerCase().includes(query))
        return matchesStatus && (searchQuery === '' || matchesSearch)
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

    const handleStatusChange = async (prep: LessonPreparation, status: 'draft' | 'ready' | 'delivered') => {
        await genericUpdateMutation.mutateAsync({
            id: prep.id,
            data: { status }
        })
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
                    <h2 className="text-2xl font-bold tracking-tight">{t('pages.prep.preparations', 'Lesson Preparations')}</h2>
                    <p className="text-muted-foreground">
                        {t('pages.prep.managePreps', 'Create and manage your lesson plans and teaching materials.')}
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2 shrink-0">
                    <Plus className="h-4 w-4" />
                    {t('pages.prep.createPrep', 'Create Preparation')}
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
                            {t('pages.prep.status.draft', 'Draft')} <span className="text-muted-foreground ml-1">({statusCounts.draft})</span>
                        </SelectItem>
                        <SelectItem value="ready">
                            {t('pages.prep.status.ready', 'Ready')} <span className="text-muted-foreground ml-1">({statusCounts.ready})</span>
                        </SelectItem>
                        <SelectItem value="delivered">
                            {t('pages.prep.status.delivered', 'Delivered')} <span className="text-muted-foreground ml-1">({statusCounts.delivered})</span>
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
                                ? t('pages.prep.noMatchingPreps', 'No preparations match your filters')
                                : t('pages.prep.noPreparations', 'No lesson preparations yet')}
                        </h3>
                        <p className="text-sm text-muted-foreground max-w-sm mb-6">
                            {searchQuery || statusFilter !== 'all'
                                ? t('pages.prep.tryAdjusting', 'Try adjusting your search or filters to find what you looking for.')
                                : t('pages.prep.startCreating', 'Start by creating your first lesson preparation plan.')}
                        </p>
                        {(searchQuery || statusFilter !== 'all') ? (
                            <Button variant="outline" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
                                {t('common.clearFilters', 'Clear Filters')}
                            </Button>
                        ) : (
                            <Button onClick={handleCreate}>
                                <Plus className="h-4 w-4 mr-2" />
                                {t('pages.prep.createFirst', 'Create First Preparation')}
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
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            {/* View Details Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                    <DialogHeader className="shrink-0 border-b pb-4">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <span className="font-mono bg-muted px-2 py-0.5 rounded text-base text-muted-foreground">#{selectedPrep?.lesson_number}</span>
                            <span>{selectedPrep?.knowledge_resource}</span>
                            {selectedPrep?.subject && (
                                <Badge variant="outline" className="ml-2 font-normal text-sm text-muted-foreground">
                                    {selectedPrep.subject}
                                </Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto py-4">
                        {selectedPrep && <LessonPrepDetails data={selectedPrep} />}
                    </div>
                    <div className="flex justify-between items-center gap-2 pt-4 border-t shrink-0">
                        <Button variant="outline" onClick={() => window.print()} className="gap-2">
                            <Printer className="h-4 w-4" />
                            {t('common.print', 'Print')}
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                {t('common.close', 'Close')}
                            </Button>
                            <Button
                                onClick={() => {
                                    setViewDialogOpen(false);
                                    if (selectedPrep) {
                                        handleEdit(selectedPrep);
                                    }
                                }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                {t('common.edit', 'Edit')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Create/Edit Form Dialog */}
            <Dialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
                <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0 gap-0 [&>button]:hidden">
                    <div className="px-6 py-4 border-b flex justify-between items-center shrink-0 bg-background">
                        <DialogTitle>
                            {selectedPrep ? t('pages.prep.editPrep', 'Edit Lesson Preparation') : t('pages.prep.createPrep', 'New Lesson Preparation')}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <FormLanguageSelector
                                value={formLanguage}
                                onChange={setFormLanguage}
                            />
                            <DialogClose asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Close</span>
                                </Button>
                            </DialogClose>
                        </div>
                    </div>
                    <div className="flex-1 min-h-0 overflow-hidden">
                        <LessonPrepForm
                            initialData={selectedPrep}
                            onSubmit={handleFormSubmit}
                            isLoading={createMutation.isPending || updateMutation.isPending}
                            levels={teacherLevels}
                            subjects={teacherSubjects}
                            onCancel={() => setFormDialogOpen(false)}
                            language={formLanguage}
                            nextLessonNumber={selectedPrep ? undefined : (() => {
                                let num = 1
                                const existing = new Set(allPreps.map(p => p.lesson_number))
                                while (existing.has(String(num))) {
                                    num++
                                }
                                return String(num)
                            })()}
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
                            {t('pages.prep.deletePrepConfirm', 'This action cannot be undone. This will permanently delete the lesson preparation.')}
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
