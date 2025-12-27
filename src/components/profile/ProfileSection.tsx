import type { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ProfileSectionProps {
  title: string
  children: ReactNode
  className?: string
  columns?: 1 | 2 | 3
}

/**
 * Reusable section component for profile pages
 * - Larger internal padding for better readability
 * - Grid-based layout with configurable columns
 * - Compact header with no description for cleaner look
 */
export function ProfileSection({ 
  title, 
  children, 
  className,
  columns = 2
}: ProfileSectionProps) {
  const gridClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  }

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="pb-2 pt-4 px-5">
        <CardTitle className="text-base font-semibold text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-2">
        <div className={cn(
          'grid gap-4',
          gridClass[columns]
        )}>
          {children}
        </div>
      </CardContent>
    </Card>
  )
}
