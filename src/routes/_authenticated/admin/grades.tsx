import { createFileRoute } from '@tanstack/react-router'
import GradesPage from '@/pages/GradesPage'

export const Route = createFileRoute('/_authenticated/admin/grades')({
  beforeLoad: () => {
    // Access control handled globally by RBAC system (specifically !/admin/grades exclusion)
  },
  component: GradesPage,
})
