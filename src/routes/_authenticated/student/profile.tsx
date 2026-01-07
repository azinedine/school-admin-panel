import { createFileRoute } from '@tanstack/react-router'
import { UnifiedProfilePage } from '@/components/features/profile'

export const Route = createFileRoute('/_authenticated/student/profile')({
  component: UnifiedProfilePage,
})
