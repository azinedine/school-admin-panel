import { createFileRoute, redirect } from '@tanstack/react-router'
import { UsersManagementPage } from '@/pages/UsersManagementPage'
import { useAuthStore } from '@/store/auth-store'

export const Route = createFileRoute('/_authenticated/users/')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user?.role === 'parent') {
      throw redirect({
        to: '/unauthorized',
      })
    }
  },
  component: UsersManagementPage,
})
