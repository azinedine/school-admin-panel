import { createFileRoute } from '@tanstack/react-router'
import { LessonMemoView } from '@/components/features/lessons/memo/LessonMemoView'

export const Route = createFileRoute(
    '/_authenticated/teacher/lessons/$lessonId/memo',
)({
    component: LessonMemoPage,
})

function LessonMemoPage() {
    const { lessonId } = Route.useParams()
    return <LessonMemoView lessonId={Number(lessonId)} />
}
