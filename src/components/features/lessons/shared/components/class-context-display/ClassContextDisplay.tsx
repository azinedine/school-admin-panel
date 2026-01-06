import { useClassContext } from '@/hooks/use-classes'
import { ClassContextSkeleton } from './ClassContextSkeleton'
import { ClassContextContent } from './ClassContextContent'

interface ClassContextDisplayProps {
    classId?: string
}

export function ClassContextDisplay({ classId }: ClassContextDisplayProps) {
    const { data, isLoading, error } = useClassContext(classId)

    if (!classId) return null

    if (isLoading) {
        return <ClassContextSkeleton />
    }

    if (error || !data) {
        return null
    }

    return <ClassContextContent name={data.name} subject={data.subject} />
}
