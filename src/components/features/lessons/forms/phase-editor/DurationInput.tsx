import { type Control } from 'react-hook-form'
import { Clock } from 'lucide-react'
import { FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { LessonPreparationFormData } from '@/schemas/lesson-preparation'

interface DurationInputProps {
    control: Control<LessonPreparationFormData>
    name: `phases.${number}.duration_minutes`
    disabled?: boolean
    label?: string
}

/**
 * Reusable duration input with clock icon
 * Interface Segregation: Minimal, focused props
 */
export function DurationInput({
    control,
    name,
    disabled,
    label = 'min',
}: DurationInputProps) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                    <FormControl>
                        <div className="relative w-24">
                            <Clock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                {...field}
                                type="number"
                                min={1}
                                className="pl-9 h-9 text-right font-mono"
                                disabled={disabled}
                                onChange={e => field.onChange(Number(e.target.value))}
                            />
                        </div>
                    </FormControl>
                    <span className="text-xs text-muted-foreground">{label}</span>
                </FormItem>
            )}
        />
    )
}
