import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/parent/children')({
  component: () => (
    <ContentPage title="Children Profiles" description="View and manage children information">
       <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Children profiles coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
