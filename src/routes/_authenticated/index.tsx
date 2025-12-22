import { ContentPage } from '@/components/layout/content-page'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: HomePage,
})

function HomePage() {
  return (
    <ContentPage title="Home Page" description="Over View">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">This page is coming soon...</p>
        </div>
      </div>
    </ContentPage>
  )
}
