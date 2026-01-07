import { useTranslation } from 'react-i18next'
import type { User } from '@/store/types'
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  UserSheetHeader,
  PersonalInfoSection,
  InstitutionInfoSection,
  ProfessionalInfoSection,
  AccountInfoSection,
} from './sheet-sections'

interface UserDetailsSheetProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

/**
 * UserDetailsSheet Component
 * 
 * Orchestrator component that displays user details in a sidebar sheet.
 * Uses specialized sub-components for each section (SOLID principle).
 */
export function UserDetailsSheet({ user, isOpen, onClose }: UserDetailsSheetProps) {
  const { t, i18n } = useTranslation()
  const isArabic = i18n.language === 'ar'

  if (!user) return null

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side={isArabic ? 'left' : 'right'}
        className="w-full sm:w-[500px] overflow-y-auto p-0 flex flex-col h-full"
      >
        <UserSheetHeader user={user} />

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <PersonalInfoSection user={user} />
          <InstitutionInfoSection user={user} />
          <ProfessionalInfoSection user={user} />
          <AccountInfoSection user={user} />
        </div>

        <div className="sticky bottom-0 bg-background p-4 border-t mt-auto z-10">
          <Button onClick={onClose} variant="outline" className="w-full">
            {t('common.close', 'Close')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
