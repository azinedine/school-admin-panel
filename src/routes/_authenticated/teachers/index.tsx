
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useDeleteTeacher, useTeachers } from '@/hooks/use-teachers'
import { createFileRoute } from '@tanstack/react-router'
import { Loader2, Trash2, UserX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const Route = createFileRoute('/_authenticated/teachers/')({
  component: TeachersPage,
})

function TeachersPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useTeachers()
  const { mutate: deleteTeacher, isPending: isDeleting } = useDeleteTeacher()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t('teachers.title', 'Teachers')}</h2>
          <p className="text-muted-foreground">{t('teachers.description', 'Manage teacher accounts')}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('teachers.list', 'Teachers List')}</CardTitle>
          <CardDescription>
            {t('teachers.count', { count: data?.meta.total || 0 })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <UserX className="h-12 w-12 mb-2 opacity-20" />
              <p>{t('teachers.empty', 'No teachers found')}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.name', 'Name')}</TableHead>
                  <TableHead>{t('common.email', 'Email')}</TableHead>
                  <TableHead>{t('common.joined', 'Joined')}</TableHead>
                  <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.name}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>
                      {new Date(teacher.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>{t('common.confirmDelete', 'Are you sure?')}</AlertDialogTitle>
                            <AlertDialogDescription>
                              {t('teachers.deleteWarning', 'This action cannot be undone. This will permanently delete the teacher account.')}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deleteTeacher(teacher.id)}
                            >
                              {t('common.delete', 'Delete')}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
