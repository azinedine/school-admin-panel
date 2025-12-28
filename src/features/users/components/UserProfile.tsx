/**
 * User Profile Component
 * 
 * Displays current user's profile information.
 * Uses the user query hook from the users feature.
 */

import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { useUser } from '../api/use-user'

export function UserProfile() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  
  const { data: user, isLoading, error } = useUser()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-32" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error || !user) {
    return (
      <Card>
        <CardContent className="py-4 text-center text-muted-foreground">
          {t('common.error')}
        </CardContent>
      </Card>
    )
  }

  const displayName = isRTL && user.name_ar ? user.name_ar : user.name

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('profilePage.title')}</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.avatar} alt={displayName} />
          <AvatarFallback>
            {displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">{displayName}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {t(`auth.roles.${user.role}`, user.role)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
