import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Plus, Pencil, Trash2, Shield, AlertCircle, Loader2 } from 'lucide-react'
import { ContentPage } from '@/components/layout/content-page'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FullScreenLoader } from '@/components/ui/full-screen-loader'
import { useRoles, useCreateRole, useUpdateRole, useDeleteRole, type Role } from '@/hooks/use-roles'

export const Route = createFileRoute('/_authenticated/super-admin/roles')({
  component: RolesPage,
})

function RolesPage() {
  const { t } = useTranslation()
  const { data: roles, isLoading, error } = useRoles()
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const deleteRole = useDeleteRole()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
  })

  const openCreateDialog = () => {
    setSelectedRole(null)
    setFormData({ name: '', display_name: '', description: '' })
    setIsDialogOpen(true)
  }

  const openEditDialog = (role: Role) => {
    setSelectedRole(role)
    setFormData({
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
    })
    setIsDialogOpen(true)
  }

  const openDeleteDialog = (role: Role) => {
    setSelectedRole(role)
    setIsDeleteDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedRole) {
      await updateRole.mutateAsync({ id: selectedRole.id, data: formData })
    } else {
      await createRole.mutateAsync(formData)
    }
    
    setIsDialogOpen(false)
  }

  const handleDelete = async () => {
    if (selectedRole) {
      await deleteRole.mutateAsync(selectedRole.id)
      setIsDeleteDialogOpen(false)
    }
  }

  if (isLoading) {
    return <FullScreenLoader message={t('common.loading')} />
  }

  if (error) {
    return (
      <ContentPage title={t('pages.roles.title')} description={t('pages.roles.description')}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{t('common.error')}</AlertDescription>
        </Alert>
      </ContentPage>
    )
  }

  return (
    <ContentPage title={t('pages.roles.title')} description={t('pages.roles.description')}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{t('pages.roles.title')}</CardTitle>
            <CardDescription>{t('pages.roles.description')}</CardDescription>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            {t('pages.roles.addRole')}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('pages.roles.name')}</TableHead>
                <TableHead>{t('pages.roles.displayName')}</TableHead>
                <TableHead>{t('pages.roles.description')}</TableHead>
                <TableHead>{t('pages.roles.type')}</TableHead>
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.map((role) => (
                <TableRow key={role.id}>
                  <TableCell className="font-mono text-sm">{role.name}</TableCell>
                  <TableCell className="font-medium">{role.display_name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {role.description || '-'}
                  </TableCell>
                  <TableCell>
                    {role.is_system ? (
                      <Badge variant="secondary">
                        <Shield className="h-3 w-3 mr-1" />
                        {t('pages.roles.system')}
                      </Badge>
                    ) : (
                      <Badge variant="outline">{t('pages.roles.custom')}</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(role)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(role)}
                        disabled={role.is_system}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRole ? t('pages.roles.editRole') : t('pages.roles.addRole')}
            </DialogTitle>
            <DialogDescription>
              {selectedRole ? t('pages.roles.editRoleDesc') : t('pages.roles.addRoleDesc')}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('pages.roles.name')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., manager"
                  disabled={selectedRole?.is_system}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="display_name">{t('pages.roles.displayName')}</Label>
                <Input
                  id="display_name"
                  value={formData.display_name}
                  onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                  placeholder="e.g., Manager"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('pages.roles.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={t('pages.roles.descriptionPlaceholder')}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={createRole.isPending || updateRole.isPending}>
                {(createRole.isPending || updateRole.isPending) && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                {selectedRole ? t('common.update') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pages.roles.deleteRole')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pages.roles.deleteRoleDesc', { name: selectedRole?.display_name })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteRole.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ContentPage>
  )
}
