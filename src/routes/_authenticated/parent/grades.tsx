import { createFileRoute } from '@tanstack/react-router'
import { ContentPage } from '@/components/layout/content-page'

export const Route = createFileRoute('/_authenticated/parent/grades')({
  component: () => (
    <ContentPage title="My Child's Grades" description="View grades and academic progress">
       <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">Grade view for parents coming soon...</p>
        </div>
      </div>
    </ContentPage>
  ),
})
