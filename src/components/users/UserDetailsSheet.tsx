import { useTranslation } from 'react-i18next'
import type { User } from '@/store/types'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface UserDetailsSheetProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

/**
 * UserDetailsSheet Component
 * 
 * Displays full user information in a read-only sidebar sheet.
 * Shows personal data, role, institution, academic info, status, and created date.
 */
export function UserDetailsSheet({ user, isOpen, onClose }: UserDetailsSheetProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!user) return null

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  const getRoleLabel = (role: string) => {
    return t(`pages.users.roles.${role}`)
  }

  const getStatusVariant = (status: string | undefined) => {
    const s = status || 'active'
    return s === 'active'
      ? 'default'
      : s === 'inactive'
        ? 'secondary'
        : 'destructive'
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={isArabic ? 'left' : 'right'}
        className="w-full sm:w-[400px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>{t('pages.users.viewDetails.title')}</SheetTitle>
          <SheetDescription>
            {user.name}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('pages.users.viewDetails.personalInfo')}</h3>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('pages.users.table.name')}:</span>
                <span className="font-medium">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('pages.users.table.email')}:</span>
                <span className="font-medium break-all">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm">{t('pages.users.viewDetails.accountInfo')}</h3>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('pages.users.table.role')}:</span>
                <Badge variant="outline">{getRoleLabel(user.role)}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">{t('pages.users.table.status')}:</span>
                <Badge variant={getStatusVariant(user.status)}>
                  {t(`pages.users.statuses.${user.status || 'active'}`)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('pages.users.table.createdDate')}:</span>
                <span className="font-medium">{formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>

          {/* Institution Information */}
          {user.institution && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">{t('pages.users.table.institution')}</h3>
              <Separator />
              <div className="text-sm">
                <span className="font-medium">{user.institution.name}</span>
              </div>
            </div>
          )}

          {/* Academic Information */}
          {(user.subjects || user.levels) && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">{t('pages.users.viewDetails.academicInfo')}</h3>
              <Separator />
              <div className="space-y-2 text-sm">
                {user.subjects && user.subjects.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block mb-1">Subjects:</span>
                    <div className="flex flex-wrap gap-1">
                      {user.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {user.levels && user.levels.length > 0 && (
                  <div>
                    <span className="text-muted-foreground block mb-1">Levels:</span>
                    <div className="flex flex-wrap gap-1">
                      {user.levels.map((level, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Info */}
          {user.class && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Class</h3>
              <Separator />
              <div className="text-sm font-medium">{user.class}</div>
            </div>
          )}

          {user.wilaya && (
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Location</h3>
              <Separator />
              <div className="text-sm space-y-1">
                {user.wilaya && <div><span className="text-muted-foreground">Wilaya: </span>{user.wilaya}</div>}
                {user.municipality && <div><span className="text-muted-foreground">Municipality: </span>{user.municipality}</div>}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-background pt-4 border-t">
          <Button onClick={onClose} variant="outline" className="w-full">
            {t('pages.users.viewDetails.close')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
