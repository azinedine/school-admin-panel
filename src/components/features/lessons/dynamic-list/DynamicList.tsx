import {
    type Control,
    useFieldArray,
    type FieldValues,
    type Path,
    type ArrayPath,
} from 'react-hook-form'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DynamicListHeader } from './DynamicListHeader'
import { DynamicListEmptyState } from './DynamicListEmptyState'
import { DynamicListItem } from './DynamicListItem'

interface DynamicListProps<T extends FieldValues> {
    control: Control<T>
    name: ArrayPath<T>
    label: string
    placeholder: string
    emptyMessage: string
    icon: LucideIcon
    isLoading?: boolean
    className?: string
    language?: string
}

export function DynamicList<T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    emptyMessage,
    icon,
    isLoading,
    className,
    language,
}: DynamicListProps<T>) {
    const { fields, append, remove } = useFieldArray({
        control,
        name,
    })

    return (
        <div className={cn('space-y-4', className)}>
            <DynamicListHeader
                label={label}
                icon={icon}
                onAdd={() => append({ value: '' } as any)}
                isLoading={isLoading}
                language={language}
            />

            {fields.length === 0 && <DynamicListEmptyState message={emptyMessage} />}

            <div className="space-y-2">
                {fields.map((field, index) => (
                    <DynamicListItem
                        key={field.id}
                        control={control}
                        name={`${name}.${index}.value` as Path<T>}
                        fieldId={field.id}
                        placeholder={placeholder}
                        onRemove={() => remove(index)}
                        isLoading={isLoading}
                    />
                ))}
            </div>
        </div>
    )
}
