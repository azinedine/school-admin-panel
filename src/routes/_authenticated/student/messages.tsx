import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/student/messages')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/student/messages"!</div>
}
