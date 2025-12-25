import type { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Eye, MoreHorizontal } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { User } from "@/store/types"

/**
 * Format date string to a readable format
 */
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

interface UsersTableProps {
  users: User[]
  onViewDetails?: (user: User) => void
  onSuspend?: (user: User) => void
  onDelete?: (user: User) => void
}

/**
 * UsersTable Component
 * 
 * Displays a table of users with columns for name, email, role, institution, status, created date, and actions.
 * Includes sorting capabilities, role/status badges, and action dropdown menu.
 * 
 * @param users - Array of User objects to display
 * @param onViewDetails - Callback when View Details action is clicked
 * @param onSuspend - Callback when Suspend Account action is clicked
 * @param onDelete - Callback when Delete Account action is clicked
 */
export function UsersTable({ 
  users,
  onViewDetails,
  onSuspend,
  onDelete,
}: UsersTableProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  // Define table columns
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={isArabic ? "justify-end" : ""}
        >
          {t("pages.users.table.name")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={isArabic ? "justify-end" : ""}
        >
          {t("pages.users.table.email")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-sm text-muted-foreground">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "role",
      header: () => <div>{t("pages.users.table.role")}</div>,
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        const roleLabel = t(`pages.users.roles.${role}`)
        
        return (
          <Badge variant="outline" className="capitalize">
            {roleLabel}
          </Badge>
        )
      },
    },
    {
      accessorKey: "institution",
      header: () => <div>{t("pages.users.table.institution")}</div>,
      cell: ({ row }) => {
        const institution = row.original.institution
        return (
          <div className="text-sm">
            {institution?.name || "-"}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: () => <div>{t("pages.users.table.status")}</div>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string || "active"
        const statusLabel = t(`pages.users.statuses.${status}`)
        
        const statusVariant = 
          status === "active" 
            ? "default" 
            : status === "inactive"
              ? "secondary"
              : "destructive"
        
        return (
          <Badge variant={statusVariant} className="capitalize">
            {statusLabel}
          </Badge>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className={isArabic ? "justify-end" : ""}
        >
          {t("pages.users.table.createdDate")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("created_at") as string
        return (
          <div className="text-sm text-muted-foreground">
            {formatDate(date)}
          </div>
        )
      },
    },
    {
      id: "actions",
      header: () => <div>{t("pages.users.table.actions")}</div>,
      cell: ({ row }) => {
        const user = row.original
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">{t("pages.users.actions.moreActions")}</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={isArabic ? "start" : "end"}>
              {onViewDetails && (
                <DropdownMenuItem onClick={() => onViewDetails(user)} className="cursor-pointer">
                  <Eye className="mr-2 h-4 w-4" />
                  <span>{t("pages.users.actions.view")}</span>
                </DropdownMenuItem>
              )}
              {onSuspend && user.status !== "suspended" && (
                <DropdownMenuItem onClick={() => onSuspend(user)} className="cursor-pointer">
                  <span>{t("pages.users.actions.suspend")}</span>
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem 
                  onClick={() => onDelete(user)} 
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <span>{t("pages.users.actions.delete")}</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={users}
      searchKey="name"
      searchPlaceholder={t("common.search")}
    />
  )
}
