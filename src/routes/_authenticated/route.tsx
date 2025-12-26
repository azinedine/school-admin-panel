import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/store/auth-store'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    // Check for suspended status
    const user = useAuthStore.getState().user
    if (user?.status === 'suspended') {
      throw redirect({
        to: '/suspended',
      })
    }
  },
  component: AuthenticatedLayout,
})
