import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/student/attendance')({
  component: () => (
    <ContentPage title="Attendance" description="View your attendance record">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Attendance record coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
