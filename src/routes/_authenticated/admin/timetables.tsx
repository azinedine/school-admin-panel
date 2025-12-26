import { ContentPage } from '@/components/layout/content-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/admin/timetables')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ContentPage title="Timetables" description="Manage school schedules">
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="text-center space-y-4">
        <p className="text-muted-foreground">Timetable management coming soon...</p>
      </div>
    </div>
  </ContentPage>
}
