import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/student/exams')({
  component: () => (
    <ContentPage title="Exams" description="Exam schedule and preparation">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Exams coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
