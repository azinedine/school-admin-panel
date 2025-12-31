import { type Control, useFieldArray, type FieldValues, type Path, type ArrayPath } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Plus, X, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

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
    icon: Icon,
    isLoading,
    className,
    language,
}: DynamicListProps<T>) {
    const { t: originalT, i18n } = useTranslation()
    const t = language ? i18n.getFixedT(language) : originalT

    const { fields, append, remove } = useFieldArray({
        control,
        name,
    })

    return (
        <div className={cn("space-y-4", className)}>
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {label}
                </h3>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => append({ value: '' } as any)}
                    disabled={isLoading}
                    className="text-primary hover:text-primary/80 hover:bg-primary/5"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    {t('common.add', 'Add')}
                </Button>
            </div>

            {fields.length === 0 && (
                <div className="text-sm text-muted-foreground italic px-4 py-2 bg-muted/20 rounded-md border border-dashed">
                    {emptyMessage}
                </div>
            )}

            <div className="space-y-2">
                {fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 group">
                        <FormField
                            control={control}
                            name={`${name}.${index}.value` as Path<T>}
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
                            onClick={() => remove(index)}
                            disabled={isLoading}
                            className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    )
}
