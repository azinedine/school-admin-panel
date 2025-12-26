import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/super-admin/settings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/super-admin/settings"!</div>
}
