import { createRootRoute, Outlet, Navigate } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  component: () => {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    )
  },
  notFoundComponent: () => <Navigate to="/unauthorized" />,
})
