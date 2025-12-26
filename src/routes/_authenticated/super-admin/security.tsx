import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/super-admin/security')({
  component: () => (
    <ContentPage title="Security & Access" description="Manage security settings">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Security settings coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
