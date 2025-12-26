import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/teacher/students')({
  component: () => (
    <ContentPage title="Students List" description="View all your students">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Students list coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
