import { useTranslation } from 'react-i18next'
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  GraduationCap,
  Building,
  IdCard,
  AlertCircle,
  FileText
} from 'lucide-react'
import { ContentPage } from '@/components/layout/content-page'
import { Card, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  ProfileSection,
  ProfileInfoRow,
  ProfileInfoRowList,
  ProfileAvatar,
  ProfileSkeleton,
} from '@/components/profile'
import { useUser } from '@/hooks/use-auth'
import { useAuthStore } from '@/store/auth-store'

import { useState } from 'react'
import { EditProfileDialog } from './EditProfileDialog'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

export function UnifiedProfilePage() {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.dir() === 'rtl'
  const { data: userData, isLoading, isError, error } = useUser()
  // Fallback to store user if hook is loading (for immediate display)
  const storeUser = useAuthStore((state) => state.user)
  const profile = userData || storeUser
  
  const [isEditOpen, setIsEditOpen] = useState(false)
  


  // Format date for display
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  // Get gender translation
  const getGenderLabel = (gender: string | null | undefined) => {
    if (!gender) return null
    return t(`profilePage.${gender}`)
  }

  // Get status translation
  const getStatusLabel = (status: string | null | undefined) => {
    if (!status) return null
    return t(`profilePage.${status}`)
  }

  return (
    <ContentPage 
      title={t('profilePage.title')} 
      description={t('profilePage.personalInfoDesc')}
      headerActions={
        <Button onClick={() => setIsEditOpen(true)} size="sm" className="gap-2">
           <Pencil className="h-4 w-4" />
           {t('common.edit', 'Edit')}
        </Button>
      }
    >
      {/* Loading State */}
      {isLoading && !profile && <ProfileSkeleton />}

      {/* Error State */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <strong>{t('common.error')}:</strong>
            {(error as Error)?.message || t('profilePage.loadError')}
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Content */}
      {profile && (
        <>
          <div className="space-y-4">
            {/* Avatar Header - Compact */}
            <Card>
              <CardContent className="p-0">
                <ProfileAvatar
                  name={profile.name}
                  nameAr={profile.name_ar}
                  email={profile.email}
                  avatarUrl={profile.avatar}
                  role={t(`auth.roles.${profile.role}`, profile.role)}
                  status={profile.status}
                />
              </CardContent>
            </Card>

            {/* Profile Sections - Reduced gap, compact grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Personal Information */}
              <ProfileSection title={t('profilePage.personalInfo')}>
                <ProfileInfoRow
                  label={t('profilePage.fullName')}
                  value={profile.name}
                  icon={UserIcon}
                />
                <ProfileInfoRow
                  label={t('profilePage.arabicName')}
                  value={profile.name_ar}
                  icon={UserIcon}
                />
                <ProfileInfoRow
                  label={t('profilePage.gender')}
                  value={getGenderLabel(profile.gender)}
                />
                <ProfileInfoRow
                  label={t('profilePage.dateOfBirth')}
                  value={formatDate(profile.date_of_birth)}
                  icon={Calendar}
                />
              </ProfileSection>

              {/* Professional Information */}
              <ProfileSection title={t('profilePage.professionalInfo')}>
                {/* Admin Fields */}
                {profile.department && (
                  <ProfileInfoRow
                    label={t('profilePage.department')}
                    value={profile.department}
                    icon={Briefcase}
                  />
                )}
                {profile.position && (
                   <ProfileInfoRow
                    label={t('profilePage.position')}
                    value={profile.position}
                    icon={IdCard}
                  />
                )}
              
                {/* Teacher Fields */}
                {profile.teacher_id && (
                  <ProfileInfoRow
                    label={t('profilePage.teacherId')}
                    value={profile.teacher_id}
                    icon={IdCard}
                  />
                )}
                {profile.years_of_experience !== undefined && (
                  <ProfileInfoRow
                    label={t('profilePage.experience')}
                    value={t('profilePage.yearsExperience', { count: profile.years_of_experience })}
                    icon={Briefcase}
                  />
                )}
                {profile.employment_status && (
                  <ProfileInfoRow
                    label={t('profilePage.employmentStatus')}
                    value={getStatusLabel(profile.employment_status)}
                  />
                )}
                
                <ProfileInfoRow
                  label={t('profilePage.institution')}
                  value={isRTL ? (profile.institution?.name_ar || profile.institution?.name) : profile.institution?.name}
                  icon={Building}
                />
                
                {/* Admin Hiring Date */}
                {profile.date_of_hiring && (
                   <ProfileInfoRow
                    label={t('profilePage.dateOfHiring')}
                    value={formatDate(profile.date_of_hiring)}
                    icon={Calendar}
                  />
                )}

                {/* Teacher Subjects/Levels */}
                {profile.subjects && profile.subjects.length > 0 && (
                  <ProfileInfoRowList
                    label={t('profilePage.subjects')}
                    values={profile.subjects}
                    icon={GraduationCap}
                    className="col-span-full"
                  />
                )}
                {profile.levels && profile.levels.length > 0 && (
                  <ProfileInfoRowList
                    label={t('profilePage.levels')}
                    values={profile.levels}
                    className="col-span-full"
                  />
                )}
              </ProfileSection>

              {/* Contact Information */}
              <ProfileSection title={t('profilePage.contactInfo')}>
                <ProfileInfoRow
                  label={t('profilePage.email')}
                  value={profile.email}
                  icon={Mail}
                />
                <ProfileInfoRow
                  label={t('profilePage.phone')}
                  value={profile.phone}
                  icon={Phone}
                />
                {profile.work_phone && (
                   <ProfileInfoRow
                    label={t('profilePage.workPhone')}
                    value={profile.work_phone}
                    icon={Phone}
                  />
                )}
                <ProfileInfoRow
                  label={t('profilePage.wilaya')}
                  value={isRTL ? (profile.wilaya?.name_ar || profile.wilaya?.name) : profile.wilaya?.name}
                  icon={MapPin}
                />
                <ProfileInfoRow
                  label={t('profilePage.municipality')}
                  value={isRTL ? (profile.municipality?.name_ar || profile.municipality?.name) : profile.municipality?.name}
                />
                <ProfileInfoRow
                  label={t('profilePage.address')}
                  value={profile.address}
                  className="col-span-full"
                />
                 {profile.office_location && (
                   <ProfileInfoRow
                    label={t('profilePage.officeLocation')}
                    value={profile.office_location}
                    icon={MapPin}
                  />
                )}
              </ProfileSection>

              {/* Notes Section (Admin Only typically) */}
               {profile.notes && (
                  <ProfileSection title={t('profilePage.notes')}>
                      <ProfileInfoRow
                          label={t('profilePage.notes')}
                          value={profile.notes}
                          icon={FileText}
                          className="col-span-full"
                      />
                  </ProfileSection>
               )}
            </div>

            {/* Account Information */}
            <ProfileSection 
              title={t('profilePage.accountDetails')}
              columns={3}
            >
              <ProfileInfoRow
                label={t('profilePage.userId')}
                value={profile.id}
                icon={IdCard}
              />
              <ProfileInfoRow
                label={t('profilePage.role')}
                value={t(`auth.roles.${profile.role}`, profile.role)}
              />
              <ProfileInfoRow
                label={t('profilePage.accountStatus')}
                value={getStatusLabel(profile.status)}
                valueClassName={
                  profile.status === 'active' 
                    ? 'text-green-600' 
                    : profile.status === 'suspended'
                    ? 'text-red-600'
                    : 'text-gray-600'
                }
              />
               <ProfileInfoRow
                label={t('profilePage.memberSince')}
                value={formatDate(profile.created_at)}
                icon={Calendar}
              />
              {profile.updated_at && <ProfileInfoRow
                label={t('profilePage.lastUpdated')}
                value={formatDate(profile.updated_at)}
              />}
            </ProfileSection>
          </div>
          
          <EditProfileDialog 
            user={profile} 
            isOpen={isEditOpen} 
            onClose={() => setIsEditOpen(false)} 
          />
        </>
      )}
    </ContentPage>
  )
}
