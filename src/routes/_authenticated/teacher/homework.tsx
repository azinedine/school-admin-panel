import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/teacher/homework')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/teacher/homework"!</div>
}
