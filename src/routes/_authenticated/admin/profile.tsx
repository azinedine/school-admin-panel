import { createFileRoute } from '@tanstack/react-router'
import { UnifiedProfilePage } from '@/components/profile/unified-profile-page'

export const Route = createFileRoute('/_authenticated/admin/profile')({
  component: UnifiedProfilePage,
})
