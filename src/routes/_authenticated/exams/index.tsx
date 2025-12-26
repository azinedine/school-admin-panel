import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'
import ExamsPage from '@/pages/ExamsPage'

export const Route = createFileRoute('/_authenticated/exams/')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user?.role === 'parent') {
      throw redirect({
        to: '/unauthorized',
      })
    }
  },
  component: ExamsPage,
})
