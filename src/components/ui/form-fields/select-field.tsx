import type { FieldError } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  label: string
  placeholder?: string
  options: SelectOption[]
  value: string | undefined
  onChange: (value: string) => void
  error?: FieldError
  className?: string
  required?: boolean
  disabled?: boolean
  isLoading?: boolean
}

/**
 * Reusable select field with label and error display
 * Works with React Hook Form via Controller
 */
export function SelectField({
  label,
  placeholder = 'Select...',
  options,
  value,
  onChange,
  error,
  className,
  required = false,
  disabled = false,
  isLoading = false,
}: SelectFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label className="text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled || isLoading}
      >
        <SelectTrigger className={cn(error && 'border-destructive')}>
          <SelectValue 
            placeholder={isLoading ? 'Loading...' : placeholder} 
          />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  )
}
