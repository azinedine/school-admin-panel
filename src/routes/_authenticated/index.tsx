import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    
    switch (user?.role) {
      case 'parent':
        throw redirect({ to: '/parent/dashboard' })
      case 'student':
        throw redirect({ to: '/student/dashboard' })
      case 'teacher':
        throw redirect({ to: '/teacher/dashboard' })
      case 'admin':
        throw redirect({ to: '/admin/dashboard' })
      case 'super_admin':
        throw redirect({ to: '/super-admin/dashboard' })
      default:
        throw redirect({ to: '/unauthorized' })
    }
  },
  component: () => <div>Redirecting...</div>,
})
