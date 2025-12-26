import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/teacher/lessons/preparation')({
  component: () => (
    <ContentPage title="Lesson Preparation" description="Prepare your lessons">
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Lesson preparation coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
