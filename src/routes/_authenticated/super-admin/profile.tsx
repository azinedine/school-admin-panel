import { createFileRoute } from '@tanstack/react-router'
import { UnifiedProfilePage } from '@/components/features/profile'

export const Route = createFileRoute('/_authenticated/super-admin/profile')({
  component: UnifiedProfilePage,
})
