/**
 * Institution Sidebar Component
 * 
 * Shows current institution in sidebar header.
 */

import { useTranslation } from 'react-i18next'
import { Building2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

import { useUser } from '@/features/users/api/use-user'
import { useInstitution } from '../api/use-institution'
import { useActiveInstitutionId } from '@/stores/institution-store'

export function InstitutionSidebar() {
  const { i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'

  const { data: user, isLoading: userLoading } = useUser()
  const activeInstitutionId = useActiveInstitutionId()
  
  const { data: institution, isLoading: institutionLoading } = useInstitution(
    activeInstitutionId ?? user?.institution_id ?? undefined
  )

  if (userLoading || institutionLoading) {
    return <Skeleton className="h-4 w-24" />
  }

  const institutionName = institution
    ? (isRTL ? institution.name_ar || institution.name : institution.name)
    : user?.institution?.name

  if (!institutionName) return null

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/80 truncate">
      <Building2 className="h-3 w-3 shrink-0" />
      <span className="truncate" title={institutionName}>
        {institutionName}
      </span>
    </div>
  )
}
