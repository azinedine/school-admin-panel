import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { 
  Building2, 
  MapPin, 
  BookOpen, 
  GraduationCap, 
  Users, 
  Mail, 
  Calendar,
  Shield,
  Globe,
  Palette,
  Bell
} from 'lucide-react'
import { ContentPage } from '@/components/layout/content-page'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useUser } from '@/hooks/use-auth'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const { t, i18n } = useTranslation()
  const { data: user, isLoading, isError } = useUser()

  if (isLoading) {
    return (
      <ContentPage
        title={t('nav.profile.title', 'User Profile')}
        description={t('nav.settings', 'Manage your account settings and preferences')}
      >
         <div className='max-w-6xl mx-auto space-y-6'>
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-[200px] w-full rounded-xl" />
            </div>
         </div>
      </ContentPage>
    )
  }

  if (isError || !user) {
    return (
       <ContentPage
        title={t('nav.profile.title', 'User Profile')}
        description={t('nav.settings', 'Manage your account settings and preferences')}
      >
        <div className="flex items-center justify-center h-40">
           <p className="text-destructive">{t('nav.profile.loadError', 'Failed to load user profile.')}</p>
        </div>
      </ContentPage>
    )
  }

  return (
    <ContentPage
      title={t('nav.profile.title', 'User Profile')}
      description={t('nav.settings', 'Manage your account settings and preferences')}
    >
      <div className='max-w-6xl mx-auto space-y-6'>
        {/* Profile Header */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col sm:flex-row items-center gap-6'>
              <Avatar className='h-24 w-24 ring-4 ring-background'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='text-2xl font-semibold'>
                  {user.name?.substring(0, 2).toUpperCase() ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className='text-center sm:text-left space-y-2 flex-1'>
                <div className='flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start'>
                  <h2 className='text-3xl font-bold'>{user.name}</h2>
                  <Badge variant='secondary' className='uppercase text-xs font-semibold'>
                    {user.role ? t(`auth.roles.${user.role}`, user.role) : 'User'}
                  </Badge>
                </div>
                <div className='flex items-center gap-2 text-muted-foreground justify-center sm:justify-start'>
                  <Mail className='h-4 w-4' />
                  <p>{user?.email}</p>
                </div>
                <div className='flex items-center gap-2 text-sm text-muted-foreground justify-center sm:justify-start'>
                  <Calendar className='h-4 w-4' />
                  <span>
                    {t('nav.profile.joined', 'Joined')}:{' '}
                    {user?.created_at
                      ? format(new Date(user.created_at), 'PPP')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Information Grid */}
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {/* Academic/Professional Information */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <GraduationCap className='h-5 w-5' />
                {t('nav.profile.academicInfo', 'Academic Information')}
              </CardTitle>
              <CardDescription>
                {t('nav.profile.academicDesc', 'Your educational details')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {user.institution && user.institution.name ? (
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                    <Building2 className='h-4 w-4' />
                    {t('nav.profile.institution', 'Institution')}
                  </div>
                  <p className='font-medium ps-6'>{user.institution.name}</p>
                </div>
              ) : null}
              
              {user.wilaya && (
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                    <MapPin className='h-4 w-4' />
                    {t('auth.register.wilaya', 'Wilaya')}
                  </div>
                  <p className='font-medium ps-6'>{user.wilaya}</p>
                </div>
              )}
              
              {user.municipality && (
                <div className='space-y-1'>
                  <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                    <MapPin className='h-4 w-4' />
                    {t('auth.register.municipality', 'Municipality')}
                  </div>
                  <p className='font-medium ps-6'>{user.municipality}</p>
                </div>
              )}

              {!user.institution && !user.wilaya && !user.municipality && (
                <p className='text-sm text-muted-foreground italic'>
                  {t('nav.profile.noAcademicInfo', 'No academic information available')}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Role-Specific Information */}
          {(user.role === 'teacher' && (user.subjects?.length || user.levels?.length)) ||
           (user.role === 'student' && user.class) ||
           (user.role === 'parent' && user.linkedStudentId) ? (
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <BookOpen className='h-5 w-5' />
                  {user.role === 'teacher' && t('nav.profile.teachingInfo', 'Teaching Information')}
                  {user.role === 'student' && t('nav.profile.studentInfo', 'Student Information')}
                  {user.role === 'parent' && t('nav.profile.parentInfo', 'Parent Information')}
                </CardTitle>
                <CardDescription>
                  {user.role === 'teacher' && t('nav.profile.teachingDesc', 'Subjects and levels you teach')}
                  {user.role === 'student' && t('nav.profile.studentDesc', 'Your class information')}
                  {user.role === 'parent' && t('nav.profile.parentDesc', 'Linked student details')}
                </CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                {/* Teacher Specific */}
                {user.role === 'teacher' && (
                  <>
                    {user.subjects && user.subjects.length > 0 && (
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-muted-foreground'>
                          {t('nav.profile.subjects', 'Subjects')}
                        </label>
                        <div className='flex flex-wrap gap-2'>
                          {user.subjects.map((subject) => (
                            <Badge key={subject} variant='outline'>
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {user.levels && user.levels.length > 0 && (
                      <div className='space-y-2'>
                        <label className='text-sm font-medium text-muted-foreground'>
                          {t('nav.profile.levels', 'Levels')}
                        </label>
                        <div className='flex flex-wrap gap-2'>
                          {user.levels.map((level) => (
                            <Badge key={level} variant='outline'>
                              {level}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Student Specific */}
                {user.role === 'student' && user.class && (
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                      <Users className='h-4 w-4' />
                      {t('nav.profile.class', 'Class')}
                    </div>
                    <p className='font-medium ps-6'>{user.class}</p>
                  </div>
                )}
                
                {/* Parent Specific */}
                {user.role === 'parent' && user.linkedStudentId && (
                  <div className='space-y-1'>
                    <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                      <Users className='h-4 w-4' />
                      {t('nav.profile.linkedStudent', 'Linked Student ID')}
                    </div>
                    <p className='font-medium ps-6'>{user.linkedStudentId}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null}

          {/* Account Details */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Shield className='h-5 w-5' />
                {t('nav.profile.accountDetails', 'Account Details')}
              </CardTitle>
              <CardDescription>
                {t('nav.profile.accountDesc', 'Your account information')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1'>
                <label className='text-sm font-medium text-muted-foreground'>
                  {t('nav.profile.userId', 'User ID')}
                </label>
                <p className='font-mono text-sm ps-0'>{user.id}</p>
              </div>
              
              <Separator />
              
              <div className='space-y-1'>
                <label className='text-sm font-medium text-muted-foreground'>
                  {t('nav.profile.accountStatus', 'Account Status')}
                </label>
                <div className='flex items-center gap-2 ps-0'>
                  <Badge variant='outline' className='bg-green-50 text-green-700 border-green-200'>
                    {t('nav.profile.active', 'Active')}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className='space-y-1'>
                <label className='text-sm font-medium text-muted-foreground'>
                  {t('nav.profile.memberSince', 'Member Since')}
                </label>
                <p className='text-sm ps-0'>
                  {user.created_at
                    ? format(new Date(user.created_at), 'MMMM yyyy')
                    : 'N/A'}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Palette className='h-5 w-5' />
                {t('nav.profile.preferences', 'Preferences')}
              </CardTitle>
              <CardDescription>
                {t('nav.profile.preferencesDesc', 'Your app preferences')}
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-1'>
                <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                  <Globe className='h-4 w-4' />
                  {t('nav.profile.language', 'Language')}
                </div>
                <p className='font-medium ps-6'>
                  {i18n.language === 'en' && 'English'}
                  {i18n.language === 'fr' && 'Français'}
                  {i18n.language === 'ar' && 'العربية'}
                </p>
              </div>

              <Separator />

              <div className='space-y-1'>
                <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
                  <Bell className='h-4 w-4' />
                  {t('nav.profile.notifications', 'Notifications')}
                </div>
                <p className='text-sm text-muted-foreground ps-6'>
                  {t('nav.profile.notificationsEnabled', 'Enabled')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentPage>
  )
}
