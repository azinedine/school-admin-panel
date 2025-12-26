import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/super-admin/schools')({
  component: () => (
    <ContentPage title="Schools / Institutions" description="Manage schools">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Schools management coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
