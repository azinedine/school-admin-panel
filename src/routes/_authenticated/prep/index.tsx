import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/prep/')({
  component: () => (
    <ContentPage title="Class Preparation" description="Prepare and organize class materials">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">This page is coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
