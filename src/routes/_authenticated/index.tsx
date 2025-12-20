import { createFileRoute } from '@tanstack/react-router'
import ExamsPage from '@/pages/ExamsPage'

export const Route = createFileRoute('/_authenticated/')({
  component: ExamsPage,
})
