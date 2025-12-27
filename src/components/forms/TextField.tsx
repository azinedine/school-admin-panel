import type { FieldError, UseFormRegisterReturn } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

interface TextFieldProps {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'tel'
  registration: UseFormRegisterReturn
  error?: FieldError
  className?: string
  required?: boolean
  disabled?: boolean
}

/**
 * Reusable text input field with label and error display
 * Integrates with React Hook Form
 */
export function TextField({
  label,
  placeholder,
  type = 'text',
  registration,
  error,
  className,
  required = false,
  disabled = false,
}: TextFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={registration.name} className="text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={registration.name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(error && 'border-destructive')}
        {...registration}
      />
      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  )
}

interface TextAreaFieldProps {
  label: string
  placeholder?: string
  registration: UseFormRegisterReturn
  error?: FieldError
  className?: string
  required?: boolean
  rows?: number
}

/**
 * Reusable textarea field
 */
export function TextAreaField({
  label,
  placeholder,
  registration,
  error,
  className,
  required = false,
  rows = 3,
}: TextAreaFieldProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={registration.name} className="text-sm">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <textarea
        id={registration.name}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-destructive'
        )}
        {...registration}
      />
      {error && (
        <p className="text-xs text-destructive">{error.message}</p>
      )}
    </div>
  )
}
