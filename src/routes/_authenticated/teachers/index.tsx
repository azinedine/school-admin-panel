
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
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'
import { Trash2, UserX } from 'lucide-react'
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
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user?.role === 'parent') {
      throw redirect({
        to: '/unauthorized',
      })
    }
  },
  component: TeachersPage,
})
import { FullScreenLoader } from '@/components/ui/full-screen-loader'

function TeachersPage() {
  const { t, i18n } = useTranslation()
  const { data, isLoading } = useTeachers()
  const { mutate: deleteTeacher, isPending: isDeleting } = useDeleteTeacher()

  if (isLoading) {
    return <FullScreenLoader message={t('common.loading')} />
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
                  <TableHead>{t('profilePage.institution', 'School')}</TableHead>
                  <TableHead>{t('profilePage.wilaya', 'State')}</TableHead>
                  <TableHead>{t('profilePage.gender', 'Gender')}</TableHead>
                  <TableHead>{t('common.email', 'Email')}</TableHead>
                  <TableHead className="text-right">{t('common.actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">
                        <div className="flex flex-col">
                            <span>{i18n.dir() === 'rtl' ? (teacher.name_ar || teacher.name) : teacher.name}</span>
                            {teacher.name_ar && i18n.dir() !== 'rtl' && <span className="text-xs text-muted-foreground">{teacher.name_ar}</span>}
                        </div>
                    </TableCell>
                    <TableCell>
                        {i18n.dir() === 'rtl' ? (teacher.institution?.name_ar || teacher.institution?.name) : teacher.institution?.name}
                    </TableCell>
                    <TableCell>
                        {i18n.dir() === 'rtl' ? (teacher.wilaya?.name_ar || teacher.wilaya?.name) : teacher.wilaya?.name}
                    </TableCell>
                    <TableCell>
                        {teacher.gender ? t(`profilePage.${teacher.gender}`) : '-'}
                    </TableCell>
                    <TableCell>{teacher.email}</TableCell>
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
