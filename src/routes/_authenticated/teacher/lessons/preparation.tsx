import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ContentPage } from '@/components/layout/content-page'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useLessonPreps, useCreateLessonPrep, useUpdateLessonPrep } from '@/hooks/use-lesson-preparation'
import { LessonPrepForm } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonPrepForm'
import { LessonPrepTable } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonPrepTable'
import { LessonPrepDetails } from '@/routes/_authenticated/teacher/lessons/_addLessons/LessonPrepDetails'

import type { LessonPreparation, LessonPreparationFormData } from '@/schemas/lesson-preparation'

export const Route = createFileRoute('/_authenticated/teacher/lessons/preparation')({
  component: PreparationPage,
})

const MOCK_CLASSES = ['10-A', '10-B', '10-C', '11-A', '11-B', '12-A']
const MOCK_SUBJECTS = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History']

function PreparationPage() {
  const { t } = useTranslation()
  const [formOpen, setFormOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [editingPrep, setEditingPrep] = useState<LessonPreparation | null>(null)
  const [selectedPrep, setSelectedPrep] = useState<LessonPreparation | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'ready' | 'delivered'>('all')

  const { data: allPreps = [], isLoading } = useLessonPreps()
  const { mutateAsync: createPrep, isPending: isCreating } = useCreateLessonPrep()
  const { mutateAsync: updatePrep, isPending: isUpdating } = useUpdateLessonPrep(editingPrep?.id || 0)

  // Filter preparations based on status
  const filteredPreps = allPreps.filter((prep) => {
    if (statusFilter === 'all') return true
    return prep.status === statusFilter
  })

  const handleCreateClick = () => {
    setEditingPrep(null)
    setFormOpen(true)
  }

  const handleEdit = (prep: LessonPreparation) => {
    setEditingPrep(prep)
    setFormOpen(true)
  }

  const handleView = (prep: LessonPreparation) => {
    setSelectedPrep(prep)
    setDetailsOpen(true)
  }

  const handleFormSubmit = async (data: LessonPreparationFormData) => {
    try {
      if (editingPrep) {
        await updatePrep(data)
      } else {
        await createPrep(data)
      }
      setFormOpen(false)
      setEditingPrep(null)
    } catch (error) {
      console.error('Failed to submit form:', error)
    }
  }

  return (
    <ContentPage
      title="Lesson Preparation"
      description="Create and manage your lesson preparations"
      headerActions={
        <Button onClick={handleCreateClick} className="gap-2">
          <Plus className="h-4 w-4" />
          New Preparation
        </Button>
      }
    >
      {/* Tabs for status filtering */}
      <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">
            All ({allPreps.length})
          </TabsTrigger>
          <TabsTrigger value="draft">
            Draft ({allPreps.filter((p) => p.status === 'draft').length})
          </TabsTrigger>
          <TabsTrigger value="ready">
            Ready ({allPreps.filter((p) => p.status === 'ready').length})
          </TabsTrigger>
          <TabsTrigger value="delivered">
            Delivered ({allPreps.filter((p) => p.status === 'delivered').length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Lesson Preparations Table */}
      <LessonPrepTable
        data={filteredPreps}
        isLoading={isLoading}
        onEdit={handleEdit}
        onView={handleView}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPrep ? 'Edit Lesson Preparation' : 'Create New Lesson Preparation'}
            </DialogTitle>
            <DialogDescription>
              {editingPrep
                ? 'Update your lesson preparation details'
                : 'Create a new lesson preparation with learning objectives, topics, and assessment methods'}
            </DialogDescription>
          </DialogHeader>
          <LessonPrepForm
            initialData={editingPrep || undefined}
            onSubmit={handleFormSubmit}
            isLoading={isCreating || isUpdating}
            classes={MOCK_CLASSES}
            subjects={MOCK_SUBJECTS}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lesson Preparation Details</DialogTitle>
          </DialogHeader>
          {selectedPrep && <LessonPrepDetails data={selectedPrep} />}
        </DialogContent>
      </Dialog>
    </ContentPage>
  )
}
