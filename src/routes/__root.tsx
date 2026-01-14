import { createRootRoute, Outlet, Navigate } from '@tanstack/react-router'
import { Toaster } from '@/components/ui/sonner'
import { useState, useEffect } from 'react'
import { NoInternet } from '@/components/common/NoInternet'

export const Route = createRootRoute({
  component: () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine)

    useEffect(() => {
      const handleOnline = () => setIsOnline(true)
      const handleOffline = () => setIsOnline(false)

      window.addEventListener('online', handleOnline)
      window.addEventListener('offline', handleOffline)

      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }, [])

    if (!isOnline) {
      return <NoInternet onRetry={() => window.location.reload()} />
    }

    return (
      <>
        <Outlet />
        <Toaster />
      </>
    )
  },
  notFoundComponent: () => <Navigate to="/unauthorized" />,
})
