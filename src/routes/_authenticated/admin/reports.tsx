import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/admin/reports')({
  component: () => (
    <ContentPage title="Reports & Statistics" description="Generate system reports">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Reports coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
