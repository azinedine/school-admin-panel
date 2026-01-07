import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileInfoRowProps {
  label: string
  value: string | number | null | undefined
  icon?: LucideIcon
  className?: string
  valueClassName?: string
  fallback?: string
}

/**
 * Compact label-value row for displaying profile information
 * - Reduced vertical spacing
 * - Icon positioned inline with label
 */
export function ProfileInfoRow({ 
  label, 
  value, 
  icon: Icon,
  className,
  valueClassName,
  fallback = '—'
}: ProfileInfoRowProps) {
  const displayValue = value ?? fallback
  
  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      <span className={cn('text-sm font-medium', valueClassName)}>
        {displayValue}
      </span>
    </div>
  )
}

interface ProfileInfoRowListProps {
  label: string
  values: string[] | null | undefined
  icon?: LucideIcon
  className?: string
  fallback?: string
}

/**
 * Compact row for displaying list of values (e.g., subjects, levels)
 */
export function ProfileInfoRowList({ 
  label, 
  values, 
  icon: Icon,
  className,
  fallback = '—'
}: ProfileInfoRowListProps) {
  const hasValues = values && values.length > 0
  
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </span>
      {hasValues ? (
        <div className="flex flex-wrap gap-1">
          {values.map((item, idx) => (
            <span 
              key={idx}
              className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">{fallback}</span>
      )}
    </div>
  )
}
