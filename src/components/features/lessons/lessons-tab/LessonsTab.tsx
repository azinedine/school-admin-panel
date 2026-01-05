import { memo } from 'react'
import { PreparationCard } from '../preparation-card/index.ts'
import { useLessonsTab } from './useLessonsTab'
import { LessonsTabHeader } from './LessonsTabHeader'
import { LessonsTabLoading } from './LessonsTabLoading'
import { LessonsTabEmptyState } from './LessonsTabEmptyState'
import { LessonsTabViewDialog } from './LessonsTabViewDialog'

/**
 * LessonsTab (Library) - View Ready Lesson Preparations
 * Connects to the Preparation module by displaying only "ready" items.
 */
export const LessonsTab = memo(function LessonsTab() {
    const {
        isLoading,
        filteredPreps,
        searchQuery,
        setSearchQuery,
        viewDialogOpen,
        selectedPrep,
        handleView,
        closeViewDialog,
    } = useLessonsTab()

    return (
        <div className="space-y-6">
            <LessonsTabHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {isLoading ? (
                <LessonsTabLoading />
            ) : filteredPreps.length === 0 ? (
                <LessonsTabEmptyState hasSearchQuery={!!searchQuery} />
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

            <LessonsTabViewDialog
                open={viewDialogOpen}
                onOpenChange={(open) => !open && closeViewDialog()}
                selectedPrep={selectedPrep}
                onClose={closeViewDialog}
            />
        </div>
    )
})
