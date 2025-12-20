import { createFileRoute } from '@tanstack/react-router'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ModeToggle } from '@/components/mode-toggle'

function ComingSoonPage({ title }: { title: string }) {
  return (
    <>
      <Header fixed>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </Header>

      <Main>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold">{title}</h1>
            <p className="text-muted-foreground">This page is coming soon...</p>
          </div>
        </div>
      </Main>
    </>
  )
}

export const Route = createFileRoute('/_authenticated/prep/')({
  component: () => <ComingSoonPage title="Class Preparation" />,
})
