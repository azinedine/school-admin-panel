import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/admin/classes')({
  component: () => (
    <ContentPage title="Classes & Subjects" description="Manage school structure">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Classes management coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
