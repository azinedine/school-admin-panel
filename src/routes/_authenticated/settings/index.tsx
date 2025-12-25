import { createFileRoute } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ContentPage } from '@/components/layout/content-page'
import { useAuthStore } from '@/store/auth-store'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'


export const Route = createFileRoute('/_authenticated/settings/')({
  component: SettingsPage,
})

function SettingsPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)

  if (!user) return null

  return (
    <ContentPage
      title={t('nav.profile.title', 'User Profile')}
      description={t('nav.settings', 'Manage your account settings and preferences')}
    >
      <div className='max-w-4xl mx-auto space-y-6'>
        {/* Header Section */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex flex-col sm:flex-row items-center gap-6'>
              <Avatar className='h-24 w-24'>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className='text-xl'>
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='text-center sm:text-left space-y-2 flex-1'>
                <div className='flex flex-col sm:flex-row items-center gap-3 justify-center sm:justify-start'>
                  <h2 className='text-2xl font-bold'>{user.name}</h2>
                  <Badge variant='secondary' className='uppercase text-xs'>
                    {t(`auth.roles.${user.role}`, user.role)}
                  </Badge>
                </div>
                <p className='text-muted-foreground'>{user.email}</p>
                <div className='text-sm text-muted-foreground'>
                  {t('nav.profile.joined', 'Joined')}:{' '}
                  {user.created_at
                    ? format(new Date(user.created_at), 'PPP')
                    : 'N/A'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <div className='grid gap-6 md:grid-cols-2'>
          {/* Academic Info */}
          <Card>
            <CardHeader>
              <CardTitle className='text-lg'>
                {t('nav.profile.academicInfo', 'Academic Information')}
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              {user.institution && user.institution.name && (
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    {t('nav.profile.institution', 'Institution')}
                  </label>
                  <p className='mt-1 font-medium'>{user.institution.name}</p>
                </div>
              )}
              
              {/* Teacher Specific */}
              {user.role === 'teacher' && (
                <>
                  {user.subjects && user.subjects.length > 0 && (
                    <div>
                      <label className='text-sm font-medium text-muted-foreground'>
                        {t('nav.profile.subjects', 'Subjects')}
                      </label>
                      <div className='flex flex-wrap gap-2 mt-1'>
                        {user.subjects.map((subject) => (
                          <Badge key={subject} variant='outline'>
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {user.levels && user.levels.length > 0 && (
                    <div>
                      <label className='text-sm font-medium text-muted-foreground'>
                        {t('nav.profile.levels', 'Levels')}
                      </label>
                      <div className='flex flex-wrap gap-2 mt-1'>
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
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    {t('nav.profile.class', 'Class')}
                  </label>
                  <p className='mt-1 font-medium'>{user.class}</p>
                </div>
              )}
              
              {/* Parent Specific */}
               {user.role === 'parent' && user.linkedStudentId && (
                <div>
                  <label className='text-sm font-medium text-muted-foreground'>
                    {t('nav.profile.linkedStudent', 'Linked Student ID')}
                  </label>
                  <p className='mt-1 font-medium'>{user.linkedStudentId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ContentPage>
  )
}
