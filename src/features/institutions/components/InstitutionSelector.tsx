/**
 * Institution Selector Component
 * 
 * Dropdown to switch active institution.
 * Reads institutions from TanStack Query, stores selection in Zustand.
 */

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Building2, ChevronDown, Check } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useUser } from '@/features/users/api/use-user'
import { useInstitution } from '../api/use-institution'
import { useInstitutionStore, useActiveInstitutionId } from '@/stores/institution-store'

export function InstitutionSelector() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  // Get user data (server state)
  const { data: user, isLoading: userLoading } = useUser()

  // Get store state (client state)
  const activeInstitutionId = useActiveInstitutionId()
  const setActiveInstitution = useInstitutionStore((s) => s.setActiveInstitution)

  // Fetch active institution details
  const { data: activeInstitution, isLoading: institutionLoading } = useInstitution(
    activeInstitutionId ?? undefined
  )

  // Auto-set user's primary institution on first load
  useEffect(() => {
    if (user?.institution_id && !activeInstitutionId) {
      setActiveInstitution(user.institution_id)
    }
  }, [user?.institution_id, activeInstitutionId, setActiveInstitution])

  // Loading state
  if (userLoading) {
    return <Skeleton className="h-9 w-40" />
  }

  // Get display name
  const institutionName = activeInstitution
    ? (isRTL ? activeInstitution.name_ar || activeInstitution.name : activeInstitution.name)
    : user?.institution?.name || t('common.selectInstitution')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 max-w-[200px]"
          disabled={institutionLoading}
        >
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{institutionName}</span>
          <ChevronDown className="h-3 w-3 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={isRTL ? 'start' : 'end'} className="w-56">
        <DropdownMenuLabel>{t('common.institution')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {/* Primary institution from user profile */}
        {user?.institution && (
          <DropdownMenuItem
            onClick={() => setActiveInstitution(user.institution!.id)}
            className="gap-2"
          >
            {activeInstitutionId === user.institution.id && (
              <Check className="h-4 w-4" />
            )}
            <span className={activeInstitutionId !== user.institution.id ? 'ml-6' : ''}>
              {isRTL ? user.institution.name_ar || user.institution.name : user.institution.name}
            </span>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
