import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_authenticated/student/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <ContentPage title="Dashboard" description="Overview of your school activity">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
          </CardContent>
        </Card>
      </div>
    </ContentPage>
  )
}
