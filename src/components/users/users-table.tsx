import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  createColumnHelper,
  type ColumnDef,
} from '@tanstack/react-table'
import type { User } from '@/store/types'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { useTranslation } from 'react-i18next'
import { Skeleton } from '@/components/ui/skeleton'
import { MoreHorizontal, Eye, Ban, Trash2, CheckCircle } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useUser as useCurrentUser } from '@/features/users/api/use-user'
import { useUpdateUser, useDeleteUser } from '@/hooks/use-users'
import { UserDetailsSheet } from './UserDetailsSheet'
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog'
import { toast } from 'sonner'

interface UsersTableProps {
  data: User[]
  isLoading: boolean
}

const columnHelper = createColumnHelper<User>()

export function UsersTable({ data, isLoading }: UsersTableProps) {
  const { t } = useTranslation()
  const { data: currentUser } = useCurrentUser()
  const { mutate: updateUser } = useUpdateUser()
  const { mutate: deleteUserMutation, isPending: isDeleting } = useDeleteUser()

  const [viewUser, setViewUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

  const canManageUsers = ['admin', 'manager', 'super_admin'].includes(currentUser?.role || '')
  const isSuperAdmin = currentUser?.role === 'super_admin'

  const handleStatusChange = (user: User) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended'
    const loadingToast = toast.loading(t('common.processing'))
    
    updateUser(
      { id: user.id, data: { status: newStatus } },
      {
        onSuccess: () => {
            toast.dismiss(loadingToast)
            toast.success(
                newStatus === 'suspended'
                ? t('pages.users.suspendAccount.success', 'User suspended successfully')
                : t('pages.users.suspendAccount.activated', 'User activated successfully')
            )
        },
        onError: () => {
            toast.dismiss(loadingToast)
            toast.error(t('pages.users.suspendAccount.error', 'Failed to update user status'))
        }
      }
    )
  }

  const handleDelete = () => {
    if (!deleteUser) return

    deleteUserMutation(deleteUser.id, {
      onSuccess: () => {
        setDeleteUser(null)
        toast.success(t('pages.users.deleteAccount.success'))
      },
      onError: () => {
        toast.error(t('pages.users.deleteAccount.error'))
      },
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TanStack Table columns with mixed accessor types require any
  const columns: ColumnDef<User, any>[] = [
    columnHelper.accessor('name', {
      header: t('users.columns.name', 'Name'),
      cell: (info) => {
        const user = info.row.original
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{user.name}</span>
            </div>
          </div>
        )
      },
    }),
    columnHelper.accessor('email', {
      header: t('users.columns.email', 'Email'),
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('role', {
      header: t('users.columns.role', 'Role'),
      cell: (info) => {
        const role = info.getValue()
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          super_admin: 'destructive',
          admin: 'default',
          manager: 'default',
          teacher: 'secondary',
          student: 'outline',
          parent: 'outline',
        }
        return <Badge variant={variants[role] || 'outline'}>{t(`auth.roles.${role}`, role) as string}</Badge>
      },
    }),
    columnHelper.accessor('institution.name', {
      header: t('users.columns.institution', 'Institution'),
      cell: (info) => info.getValue() || '-',
    }),
    columnHelper.accessor('status', {
        header: t('users.columns.status', 'Status'),
        cell: (info) => {
          const status = info.getValue() || 'active'
          const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
            active: 'default',
            inactive: 'secondary',
            suspended: 'destructive',
          }
          // Custom style for success/active to be green instead of default black
          const className = status === 'active' 
            ? 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' 
            : undefined

          return (
            <Badge variant={variants[status] || 'outline'} className={className}>
                {t(`pages.users.statuses.${status}`, status) as string}
            </Badge>
          )
        },
    }),
    columnHelper.accessor('created_at', {
      header: t('users.columns.joined', 'Joined'),
      cell: (info) => {
        try {
            return format(new Date(info.getValue()), 'MMM d, yyyy')
        } catch (e) {
            return '-'
        }
      },
    }),
  ]
  
  // Add Actions column if user has permission
  if (canManageUsers) {
    columns.push(
        columnHelper.display({
            id: 'actions',
            header: t('common.actions', 'Actions'),
            cell: ({ row }) => {
              const user = row.original
              // Prevent deleting/suspending oneself or super admins (unless you are super admin?)
              // Generally, don't allow modifying super_admin unless you are one.
              // For safety, let's just say you can't modify yourself here to avoid locking yourself out.
              const isSelf = currentUser?.id === user.id
              const isTargetSuperAdmin = user.role === 'super_admin'
              const canModify = !isSelf && (isSuperAdmin || !isTargetSuperAdmin)

              return (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">{t('common.actions')}</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{t('common.actions') as string}</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setViewUser(user)}>
                      <Eye className="mr-2 h-4 w-4" />
                      {t('pages.users.actions.view', 'View Details') as string}
                    </DropdownMenuItem>
                    
                    {canModify && (
                        <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleStatusChange(user)}>
                                {user.status === 'suspended' ? (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                                        {t('pages.users.actions.activate', 'Activate Account') as string}
                                    </>
                                ) : (
                                    <>
                                        <Ban className="mr-2 h-4 w-4 text-orange-600" />
                                        {t('pages.users.actions.suspend', 'Suspend Account') as string}
                                    </>
                                )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setDeleteUser(user)}
                                className="text-destructive focus:text-destructive"
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                {t('pages.users.actions.delete', 'Delete Account') as string}
                            </DropdownMenuItem>
                        </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )
            },
        })
    )
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="rounded-md border">
        <div className="p-4 space-y-4">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
            <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    )
  }

  return (
    <>
        <div className="rounded-md border">
        <Table>
            <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                    {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )}
                    </TableHead>
                ))}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody>
            {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                >
                    {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    {t('common.noResults', 'No results.') as string}
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>

        <UserDetailsSheet 
            user={viewUser} 
            isOpen={!!viewUser} 
            onClose={() => setViewUser(null)} 
        />

        <ConfirmDeleteDialog 
            user={deleteUser}
            isOpen={!!deleteUser}
            isLoading={isDeleting}
            onConfirm={handleDelete}
            onCancel={() => setDeleteUser(null)}
        />
    </>
  )
}
