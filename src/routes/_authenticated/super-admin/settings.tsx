import { ContentPage } from '@/components/layout/content-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/super-admin/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SettingsPage />
}

const SettingsPage = () => {
  return     <ContentPage title="Schools / Institutions" description="Manage schools">
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Settings management coming soon...</p>
          </div>
        </div>
      </ContentPage>
}