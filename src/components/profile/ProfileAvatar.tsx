import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ProfileAvatarProps {
  name: string
  nameAr?: string | null
  email: string
  avatarUrl?: string | null
  role: string
  status?: 'active' | 'inactive' | 'suspended'
  className?: string
  size?: 'lg' | 'md' | 'sm'
}

/**
 * Profile avatar header component with name, role badge, and status
 */
export function ProfileAvatar({ 
  name, 
  nameAr,
  email, 
  avatarUrl, 
  role,
  status = 'active',
  className,
  size = 'lg'
}: ProfileAvatarProps) {
  // Generate initials from name
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
  
  const statusColorMap = {
    active: 'bg-green-500/10 text-green-600 border-green-500/20',
    inactive: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
    suspended: 'bg-red-500/10 text-red-600 border-red-500/20',
  }


  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-20 w-20'
  }

  return (
    <div className={cn('flex items-center gap-4 p-4', className)}>
      <Avatar className={cn(sizeClasses[size || 'lg'], "border-2 border-primary/10")}>
        <AvatarImage src={avatarUrl || undefined} alt={name} />
        <AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
          {initials}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{name}</h2>
          {nameAr && (
            <span className="text-base text-muted-foreground" dir="rtl">
              {nameAr}
            </span>
          )}
        </div>
        <span className="text-sm text-muted-foreground">{email}</span>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="capitalize">
            {role}
          </Badge>
          <Badge 
            variant="outline" 
            className={cn('capitalize', statusColorMap[status])}
          >
            {status}
          </Badge>
        </div>
      </div>
    </div>
  )
}
