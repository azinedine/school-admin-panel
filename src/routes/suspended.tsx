import { createFileRoute } from '@tanstack/react-router'
import SuspendedPage from '@/pages/SuspendedPage'
import { useAuthStore } from '@/store/auth-store'
import { redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/suspended')({
  component: SuspendedPage,
  beforeLoad: () => {
    // If user is NOT suspended, they shouldn't be here
    const status = useAuthStore.getState().user?.status
    if (status && status !== 'suspended') {
        throw redirect({
            to: '/',
        })
    }
    // Optional: If not logged in, go to login
    if (!useAuthStore.getState().isAuthenticated) {
        throw redirect({
            to: '/login',
        })
    }
  }
})
