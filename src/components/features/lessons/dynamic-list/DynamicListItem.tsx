import { type Control, type FieldValues, type Path } from 'react-hook-form'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface DynamicListItemProps<T extends FieldValues> {
    control: Control<T>
    name: Path<T>
    fieldId: string
    placeholder: string
    onRemove: () => void
    isLoading?: boolean
}

export function DynamicListItem<T extends FieldValues>({
    control,
    name,
    fieldId,
    placeholder,
    onRemove,
    isLoading,
}: DynamicListItemProps<T>) {
    return (
        <div key={fieldId} className="flex gap-2 group">
            <FormField
                control={control}
                name={name}
                render={({ field }) => (
                    <FormItem className="flex-1">
                        <FormControl>
                            <Input
                                {...field}
                                placeholder={placeholder}
                                disabled={isLoading}
                                className="bg-background/50"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onRemove}
                disabled={isLoading}
                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}
