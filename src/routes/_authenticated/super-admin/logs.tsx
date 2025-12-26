import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/super-admin/logs')({
  component: () => (
    <ContentPage title="Logs & Audit Trails" description="View system logs">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Logs viewer coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
