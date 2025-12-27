import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  GraduationCap,
  Building,
  Clock,
  IdCard,
  AlertCircle
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
import { useTeacherProfile } from '@/hooks/use-teacher-profile'

export const Route = createFileRoute('/_authenticated/teacher/profile')({
  component: TeacherProfilePage,
})

function TeacherProfilePage() {
  const { t } = useTranslation()
  const { data: profile, isLoading, isError, error } = useTeacherProfile()

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
    >
      {/* Loading State */}
      {isLoading && <ProfileSkeleton />}

      {/* Error State */}
      {isError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center gap-2">
            <strong>{t('common.error')}:</strong>
            {error?.message || t('profilePage.loadError')}
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Content */}
      {profile && (
        <div className="space-y-4">
          {/* Avatar Header - Compact */}
          <Card>
            <CardContent className="p-0">
              <ProfileAvatar
                name={profile.name}
                nameAr={profile.name_ar}
                email={profile.email}
                avatarUrl={profile.avatar}
                role={t('auth.roles.teacher')}
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
                icon={User}
              />
              <ProfileInfoRow
                label={t('profilePage.arabicName')}
                value={profile.name_ar}
                icon={User}
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
              <ProfileInfoRow
                label={t('profilePage.teacherId')}
                value={profile.teacher_id}
                icon={IdCard}
              />
              <ProfileInfoRow
                label={t('profilePage.experience')}
                value={profile.years_of_experience 
                  ? t('profilePage.yearsExperience', { count: profile.years_of_experience })
                  : null
                }
                icon={Briefcase}
              />
              <ProfileInfoRow
                label={t('profilePage.employmentStatus')}
                value={getStatusLabel(profile.employment_status)}
              />
              <ProfileInfoRow
                label={t('profilePage.institution')}
                value={profile.institution?.name}
                icon={Building}
              />
              <ProfileInfoRowList
                label={t('profilePage.subjects')}
                values={profile.subjects}
                icon={GraduationCap}
                className="col-span-full"
              />
              <ProfileInfoRowList
                label={t('profilePage.levels')}
                values={profile.levels}
                className="col-span-full"
              />
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
              <ProfileInfoRow
                label={t('profilePage.wilaya')}
                value={profile.wilaya}
                icon={MapPin}
              />
              <ProfileInfoRow
                label={t('profilePage.municipality')}
                value={profile.municipality}
              />
              <ProfileInfoRow
                label={t('profilePage.address')}
                value={profile.address}
                className="col-span-full"
              />
            </ProfileSection>

            {/* Teaching Assignments */}
            <ProfileSection title={t('profilePage.teachingInfo')}>
              <ProfileInfoRowList
                label={t('profilePage.assignedClasses')}
                values={profile.assigned_classes}
                icon={GraduationCap}
              />
              <ProfileInfoRowList
                label={t('profilePage.groups')}
                values={profile.groups}
              />
              <ProfileInfoRow
                label={t('profilePage.weeklyLoad')}
                value={profile.weekly_teaching_load
                  ? t('profilePage.hoursPerWeek', { count: profile.weekly_teaching_load })
                  : null
                }
                icon={Clock}
              />
            </ProfileSection>
          </div>

          {/* Account Information - Full width, 4 columns on large */}
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
              value={t('auth.roles.teacher')}
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
            <ProfileInfoRow
              label={t('profilePage.lastUpdated')}
              value={formatDate(profile.updated_at)}
            />
          </ProfileSection>
        </div>
      )}
    </ContentPage>
  )
}
