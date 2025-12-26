import { createFileRoute } from '@tanstack/react-router'
import GradesPage from '@/pages/GradesPage'

export const Route = createFileRoute('/_authenticated/teacher/grades')({
  component: GradesPage,
})
