import { createFileRoute, redirect, Navigate } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { useAuthStore } from '@/store/auth-store'
import { isPathAllowed } from '@/lib/rbac'

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

    const user = useAuthStore.getState().user
    
    // Check for suspended status
    if (user?.status === 'suspended') {
      throw redirect({
        to: '/suspended',
      })
    }

    // Global RBAC Check
    // Skip check for root authenticated path as it handles its own redirection
    if (location.pathname !== '/') {
      if (!isPathAllowed(user?.role, location.pathname)) {
        throw redirect({
          to: '/unauthorized',
        })
      }
    }
  },
  component: AuthenticatedLayout,
  notFoundComponent: () => <Navigate to="/unauthorized" />,
})
