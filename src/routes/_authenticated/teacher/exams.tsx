import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/teacher/exams')({
  component: () => (
    <ContentPage title="Exams Management" description="Schedule and manage exams">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Exams management coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
