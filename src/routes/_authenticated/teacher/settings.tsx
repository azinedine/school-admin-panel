import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/teacher/settings')({
  component: () => (
    <ContentPage title="Settings" description="Manage your preferences">
       <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Settings coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
