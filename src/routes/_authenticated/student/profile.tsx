import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/student/profile')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/student/profile"!</div>
}
