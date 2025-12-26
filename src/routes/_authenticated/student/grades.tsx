import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/student/grades')({
  component: () => (
    <ContentPage title="Grades & Results" description="View your exam results and grades">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Grades view coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
