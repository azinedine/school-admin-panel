import { createFileRoute } from '@tanstack/react-router'
import { UsersManagementPage } from '@/pages/UsersManagementPage'

export const Route = createFileRoute('/_authenticated/admin/users')({
  component: () => (
    <UsersManagementPage />
  ),
})
