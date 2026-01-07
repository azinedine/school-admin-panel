import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  name: string
  className?: string
}

/**
 * Reusable password input field with visibility toggle
 */
export function PasswordField({
  label,
  name,
  className,
  ...props
}: PasswordFieldProps) {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { register, formState: { errors } } = useFormContext()
  const [showPassword, setShowPassword] = useState(false)
  const error = errors[name]

  return (
    <div className={cn('space-y-1.5', className)}>
      <Label htmlFor={name} className={cn(error && "text-destructive")}>
        {label}
        {props.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          type={showPassword ? "text" : "password"}
          className={cn(
            isRTL ? "pl-10" : "pr-10", 
            error && 'border-destructive'
          )}
          {...register(name)}
          {...props}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`absolute top-0 h-full px-3 py-2 hover:bg-transparent ${isRTL ? "left-0" : "right-0"}`}
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      {error && (
        <p className="text-xs text-destructive">{error.message as string}</p>
      )}
    </div>
  )
}
