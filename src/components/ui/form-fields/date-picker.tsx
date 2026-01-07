import { TextField } from "./text-field"

interface DatePickerProps {
  name: string
  label?: string
  placeholder?: string
  description?: string
  className?: string
  required?: boolean
  disabled?: boolean
}

export function DatePicker({
  name,
  label,
  placeholder,
  className,
  required,
  disabled
}: DatePickerProps) {
  return (
    <TextField
      type="date"
      name={name}
      label={label}
      placeholder={placeholder}
      className={className}
      required={required}
      disabled={disabled}
    />
  )
}
