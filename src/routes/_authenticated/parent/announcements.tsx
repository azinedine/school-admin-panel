import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/parent/announcements')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/parent/announcements"!</div>
}
