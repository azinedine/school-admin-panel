import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/store/auth-store'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/analytics/')({
  beforeLoad: () => {
    const user = useAuthStore.getState().user
    if (user?.role === 'parent') {
      throw redirect({
        to: '/unauthorized',
      })
    }
  },
  component: () => (
    <ContentPage title="Analytics" description="View performance analytics and statistics">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">This page is coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
