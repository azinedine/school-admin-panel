import { memo } from 'react'
import { Plus, X, Loader2, Trash2, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog'
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
import { LessonPrepDetails, LessonPrepForm } from '@/components/features/lessons'
import { FormLanguageSelector } from '../../forms/preparation-form/components/FormLanguageSelector'
import { usePreparationTab } from './use-preparation-tab.ts'
import { PrepFilters } from './PrepFilters.tsx'
import { PrepGrid } from './PrepGrid.tsx'

/**
 * PreparationTab - SOLID Architecture
 * Uses extracted hook and sub-components
 */
export const PreparationTab = memo(function PreparationTab() {
    const {
        t,
        i18n,
        filteredPreps,
        isLoading,
        statusCounts,
        teacherSubjects,
        teacherLevels,
        nextLessonNumber,
        viewDialogOpen,
        setViewDialogOpen,
        formDialogOpen,
        setFormDialogOpen,
        deleteDialogOpen,
        setDeleteDialogOpen,
        formLanguage,
        setFormLanguage,
        selectedPrep,
        statusFilter,
        setStatusFilter,
        searchQuery,
        setSearchQuery,
        createMutation,
        updateMutation,
        deleteMutation,
        handleCreate,
        handleEdit,
        handleView,
        handleViewMemo,
        handleDeleteClick,
        handleStatusChange,
        confirmDelete,
        handleFormSubmit,
        clearFilters,
    } = usePreparationTab()

    const hasFilters = searchQuery !== '' || statusFilter !== 'all'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t('pages.prep.preparations', 'Lesson Preparations')}
                    </h2>
                    <p className="text-muted-foreground">
                        {t(
                            'pages.prep.managePreps',
                            'Create and manage your lesson plans and teaching materials.'
                        )}
                    </p>
                </div>
                <Button onClick={handleCreate} className="gap-2 shrink-0">
                    <Plus className="h-4 w-4" />
                    {t('pages.prep.createPrep', 'Create Preparation')}
                </Button>
            </div>

            {/* Filters */}
            <PrepFilters
                t={t}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                statusCounts={statusCounts}
            />

            {/* Grid */}
            <PrepGrid
                t={t}
                isLoading={isLoading}
                preps={filteredPreps}
                hasFilters={hasFilters}
                onView={handleView}
                onViewMemo={handleViewMemo}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onStatusChange={handleStatusChange}
                onCreate={handleCreate}
                onClearFilters={clearFilters}
            />

            {/* View Details Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                    <DialogHeader className="shrink-0 border-b pb-4">
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <span className="font-mono bg-muted px-2 py-0.5 rounded text-base text-muted-foreground">
                                #{selectedPrep?.lesson_number}
                            </span>
                            <span>{selectedPrep?.knowledge_resource}</span>
                            {selectedPrep?.subject && (
                                <Badge
                                    variant="outline"
                                    className="ml-2 font-normal text-sm text-muted-foreground"
                                >
                                    {selectedPrep.subject}
                                </Badge>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex-1 overflow-y-auto py-4">
                        {selectedPrep && <LessonPrepDetails data={selectedPrep} />}
                    </div>
                    <div className="flex justify-between items-center gap-2 pt-4 border-t shrink-0">
                        <Button
                            variant="outline"
                            onClick={() => window.print()}
                            className="gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            {t('common.print', 'Print')}
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                                {t('common.close', 'Close')}
                            </Button>
                            <Button
                                onClick={() => {
                                    setViewDialogOpen(false)
                                    if (selectedPrep) {
                                        handleEdit(selectedPrep)
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
                            {selectedPrep
                                ? formLanguage
                                    ? i18n.getFixedT(formLanguage)('pages.prep.editPrep')
                                    : t('pages.prep.editPrep')
                                : formLanguage
                                    ? i18n.getFixedT(formLanguage)('pages.prep.createPrep')
                                    : t('pages.prep.createPrep')}
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
                            nextLessonNumber={selectedPrep ? undefined : nextLessonNumber}
                        />
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t('common.deleteConfirmTitle', 'Are you sure?')}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t(
                                'pages.prep.deletePrepConfirm',
                                'This action cannot be undone. This will permanently delete the lesson preparation.'
                            )}
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
