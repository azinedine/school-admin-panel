import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/updates/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/updates/"!</div>
}
