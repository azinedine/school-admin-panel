import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/admin/attendance')({
  component: () => (
    <ContentPage title="Attendance Oversight" description="Monitor detailed attendance records">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Attendance oversight coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
