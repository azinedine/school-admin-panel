import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/reports/')({
  component: () => (
    <ContentPage title="Reports" description="Generate and view reports">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">This page is coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
