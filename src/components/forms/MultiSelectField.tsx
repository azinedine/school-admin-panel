import type { FieldError } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'

interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectFieldProps {
  label: string
  options: MultiSelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  error?: FieldError
  className?: string
  required?: boolean
  columns?: 2 | 3 | 4
}

/**
 * Reusable multi-select field using checkboxes
 * Good for limited option sets like subjects/levels
 */
export function MultiSelectField({
  label,
  options,
  value,
  onChange,
  error,
  className,
  required = false,
  columns = 2,
}: MultiSelectFieldProps) {
  const handleToggle = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue])
    } else {
      onChange(value.filter((v) => v !== optionValue))
    }
  }

  const gridClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className={cn('grid gap-2', gridClass[columns])}>
        {options.map((option) => (
          <div
            key={option.value}
            className="flex items-center space-x-2"
          >
            <Checkbox
              id={`multi-${option.value}`}
              checked={value.includes(option.value)}
              onCheckedChange={(checked) => 
                handleToggle(option.value, checked as boolean)
              }
            />
            <label
              htmlFor={`multi-${option.value}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  )
}
