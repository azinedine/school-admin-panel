import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/parent/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/parent/dashboard"!</div>
}
