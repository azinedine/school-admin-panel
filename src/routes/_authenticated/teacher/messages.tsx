import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/teacher/messages')({
  component: () => (
    <ContentPage title="Messages" description="Communication with parents and students">
       <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Messages coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
