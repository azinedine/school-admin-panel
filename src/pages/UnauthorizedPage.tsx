import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { ShieldAlert } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function UnauthorizedPage() {
  const { t } = useTranslation()

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <Card className='w-full max-w-md text-center shadow-lg'>
        <CardHeader className='flex flex-col items-center gap-4'>
          <div className='bg-destructive/10 text-destructive flex size-16 items-center justify-center rounded-full'>
            <ShieldAlert className='size-8' />
          </div>
          <CardTitle className='text-2xl font-bold text-gray-900'>
            {t('auth.unauthorized.title', 'Access Denied')}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-6'>
          <p className='text-muted-foreground'>
            {t(
              'auth.unauthorized.description',
              'You do not have permission to access this page.'
            )}
          </p>
          <div className='flex justify-center'>
            <Button asChild>
              <Link to='/'>
                {t('auth.unauthorized.backToHome', 'Back to Dashboard')}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
