import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/admin/messages')({
  component: () => (
    <ContentPage title="Messages Center" description="Monitor and send messages">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Messages center coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
