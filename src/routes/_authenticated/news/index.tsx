import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/news/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/news/"!</div>
}
