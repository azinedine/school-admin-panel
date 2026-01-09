import {
    useSensor,
    useSensors,
    PointerSensor,
    KeyboardSensor,
    type DragEndEvent
} from '@dnd-kit/core'
import {
    sortableKeyboardCoordinates,
    arrayMove
} from '@dnd-kit/sortable'
import { useCallback } from 'react'
import type { CalculatedStudentGrade } from '../types'

/**
 * Hook to encapsulate Drag and Drop logic.
 *
 * Responsibility:
 * - Configures DnD sensors (pointer, keyboard).
 * - Handles `onDragEnd` event to reorder processed data locally.
 * - Triggers persist callback.
 */
export function useGradeDnD(
    students: CalculatedStudentGrade[],
    onReorder: (ids: string[]) => void
) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = students.findIndex((s) => s.id === active.id)
            const newIndex = students.findIndex((s) => s.id === over?.id)

            if (oldIndex !== -1 && newIndex !== -1) {
                // Optimistic update logic is usually handled by parent state update
                // Here we calculate the new order and call the handler
                const newOrder = arrayMove(students, oldIndex, newIndex)
                const newIds = newOrder.map(s => s.id)

                onReorder(newIds)
            }
        }
    }, [students, onReorder])

    return {
        sensors,
        handleDragEnd
    }
}
