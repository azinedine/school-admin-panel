import { useTranslation } from 'react-i18next'
import type { User } from '@/store/types'
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Briefcase,
  Shield,
} from 'lucide-react'
import {
  ProfileSection,
  ProfileInfoRow,
  ProfileAvatar,
} from '@/components/profile'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'

interface SectionProps {
  user: User
}

export function UserSheetHeader({ user }: SectionProps) {
  const { t } = useTranslation()
  return (
    <div className="p-6 bg-muted/30 border-b">
      <SheetHeader className="mb-4">
        <SheetTitle className="sr-only">{t('pages.users.viewDetails.title')}</SheetTitle>
      </SheetHeader>
      
      <div className="flex flex-col items-center">
        <ProfileAvatar
          name={user.name}
          nameAr={user.name_ar}
          email={user.email}
          avatarUrl={user.avatar}
          role={t(`auth.roles.${user.role}`, user.role)}
          status={user.status}
          size="lg"
          className="mb-4"
        />
      </div>
    </div>
  )
}

export function PersonalInfoSection({ user }: SectionProps) {
  const { t } = useTranslation()
  return (
    <ProfileSection title={t('profilePage.personalInfo')} className="border-none p-0 shadow-sm">
      <ProfileInfoRow
        label={t('profilePage.fullName')}
        value={user.name}
        icon={UserIcon}
      />
      {user.name_ar && <ProfileInfoRow
        label={t('profilePage.arabicName')}
        value={user.name_ar}
        icon={UserIcon}
      />}
      <ProfileInfoRow
        label={t('profilePage.email')}
        value={user.email}
        icon={Mail}
        className="break-all"
      />
      <ProfileInfoRow
        label={t('profilePage.phone')}
        value={user.phone}
        icon={Phone}
      />
      {user.address && <ProfileInfoRow
        label={t('profilePage.address')}
        value={user.address}
        icon={MapPin}
        className="col-span-full"
      />}
    </ProfileSection>
  )
}

export function InstitutionInfoSection({ user }: SectionProps) {
  const { t } = useTranslation()
  
  if (!user.institution && !user.user_institution_id) return null

  return (
    <ProfileSection title={t('pages.users.table.institution')} className="border-none p-0 shadow-sm">
      <ProfileInfoRow
        label={t('common.name')}
        value={user.institution?.name || `ID: ${user.user_institution_id}`}
        icon={Building}
        className="col-span-full"
      />
      <ProfileInfoRow
        label={t('profilePage.wilaya')}
        value={user.wilaya}
        icon={MapPin}
      />
      <ProfileInfoRow
        label={t('profilePage.municipality')}
        value={user.municipality}
      />
    </ProfileSection>
  )
}

export function ProfessionalInfoSection({ user }: SectionProps) {
  const { t } = useTranslation()
  
  if (!user.department && !user.position && !user.teacher_id) return null

  return (
    <ProfileSection title={t('profilePage.professionalInfo')} className="border-none p-0 shadow-sm">
      {user.department && <ProfileInfoRow label={t('profilePage.department')} value={user.department} icon={Briefcase} />}
      {user.position && <ProfileInfoRow label={t('profilePage.position')} value={user.position} icon={Briefcase} />}
      {user.teacher_id && <ProfileInfoRow label={t('profilePage.teacherId')} value={user.teacher_id} icon={Shield} />}
    </ProfileSection>
  )
}

export function AccountInfoSection({ user }: SectionProps) {
  const { t } = useTranslation()

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '—'
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  const getStatusLabel = (status: string | undefined) => {
    if (!status) return '—'
    return t(`pages.users.statuses.${status}`, status)
  }

  return (
    <ProfileSection title={t('pages.users.viewDetails.accountInfo')} columns={2} className="border-none p-0 shadow-sm">
      <ProfileInfoRow
        label={t('profilePage.role')}
        value={t(`auth.roles.${user.role}`, user.role)}
      />
      <ProfileInfoRow
        label={t('profilePage.accountStatus')}
        value={getStatusLabel(user.status)}
        valueClassName={
          user.status === 'active' 
            ? 'text-green-600' 
            : user.status === 'suspended'
            ? 'text-red-600'
            : 'text-gray-600'
        }
      />
      <ProfileInfoRow
        label={t('profilePage.memberSince')}
        value={formatDate(user.created_at)}
        icon={Calendar}
      />
      <ProfileInfoRow
        label={t('profilePage.lastUpdated')}
        value={formatDate(user.updated_at)}
      />
      {user.last_login_at && (
        <ProfileInfoRow
          label={t('profilePage.lastLogin')}
          value={formatDate(user.last_login_at)}
          className="col-span-full"
        />
      )}
    </ProfileSection>
  )
}
