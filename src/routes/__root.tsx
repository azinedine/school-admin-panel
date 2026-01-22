import { createRootRoute, Outlet, Navigate } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { NoConnection } from '@/components/common/NoInternet'
import { useConnectionStatus } from '@/hooks/use-connection-status'

function RootComponent() {
  const { status, isChecking, checkServerHealth } = useConnectionStatus({
    healthCheckInterval: 30000, // Check every 30 seconds
    enableHealthCheck: true,
  })

  // Show no connection page when offline or server is down
  if (status !== 'online') {
    return (
      <NoConnection
        type={status}
        onRetry={checkServerHealth}
        isRetrying={isChecking}
      />
    )
  }

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: () => <Navigate to="/unauthorized" />,
})
