import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/schedule/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/schedule/"!</div>
}
