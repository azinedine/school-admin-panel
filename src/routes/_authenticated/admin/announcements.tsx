import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/admin/announcements')({
  component: () => (
    <ContentPage title="Announcements" description="Manage school-wide announcements">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Announcements management coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
