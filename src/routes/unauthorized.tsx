import { createFileRoute } from '@tanstack/react-router'
import UnauthorizedPage from '@/pages/UnauthorizedPage'

export const Route = createFileRoute('/unauthorized')({
  component: UnauthorizedPage,
})
