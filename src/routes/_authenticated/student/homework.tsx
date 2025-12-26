import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/student/homework')({
  component: () => (
    <ContentPage title="Homework" description="View pending and completed assignments">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Homework coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
