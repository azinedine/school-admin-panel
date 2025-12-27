import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface FormSectionProps {
  title: string
  children: ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

/**
 * Reusable form section wrapper
 * Provides consistent card styling with grid layout for form fields
 */
export function FormSection({ 
  title, 
  children, 
  className,
  columns = 2
}: FormSectionProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3 pt-4 px-5">
        <CardTitle className="text-base font-semibold text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-0">
        <div className={cn('grid gap-4', gridClass[columns])}>
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
