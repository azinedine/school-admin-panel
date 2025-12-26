import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/super-admin/reports')({
  component: () => (
    <ContentPage title="Global Reports" description="System-wide reports">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Global reports coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
