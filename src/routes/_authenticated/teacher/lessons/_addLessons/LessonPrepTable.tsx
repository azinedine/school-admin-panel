import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Edit2, Trash2, Eye, MoreHorizontal } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import type { LessonPreparation } from '@/schemas/lesson-preparation'
import { useDeleteLessonPrep } from '@/hooks/use-lesson-preparation'

interface LessonPrepTableProps {
  data: LessonPreparation[]
  isLoading?: boolean
  onEdit?: (prep: LessonPreparation) => void
  onView?: (prep: LessonPreparation) => void
}

const statusConfig = {
  draft: {
    label: 'Draft',
    color: 'bg-gray-100 text-gray-800',
  },
  ready: {
    label: 'Ready',
    color: 'bg-blue-100 text-blue-800',
  },
  delivered: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-800',
  },
} as const

export function LessonPrepTable({
  data,
  isLoading = false,
  onEdit,
  onView,
}: LessonPrepTableProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { mutate: deletePrep, isPending: isDeleting } = useDeleteLessonPrep()

  const [deleteId, setDeleteId] = useState<number | null>(null)

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }, [data])

  const handleDelete = (id: number) => {
    deletePrep(id, {
      onSuccess: () => {
        setDeleteId(null)
      },
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-muted-foreground">Loading lesson preparations...</p>
      </div>
    )
  }

  if (sortedData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground mb-2">No lesson preparations found</p>
        <p className="text-sm text-muted-foreground">Create your first preparation to get started</p>
      </div>
    )
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Lesson Number</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.map((prep) => (
              <TableRow key={prep.id}>
                <TableCell className="font-medium">{prep.title}</TableCell>
                <TableCell>{prep.subject}</TableCell>
                <TableCell>{prep.class}</TableCell>
                <TableCell>{formatDate(prep.date)}</TableCell>
                <TableCell>{prep.duration_minutes} min</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusConfig[prep.status].color}
                  >
                    {statusConfig[prep.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onView?.(prep)}
                        className="gap-2 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit?.(prep)}
                        className="gap-2 cursor-pointer"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setDeleteId(prep.id)}
                        className="gap-2 cursor-pointer text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lesson Preparation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this lesson preparation? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => deleteId && handleDelete(deleteId)}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
