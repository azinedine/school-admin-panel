import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/teacher/profile')({
  component: () => (
    <ContentPage title="Teacher Profile" description="Your professional details">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Profile coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
