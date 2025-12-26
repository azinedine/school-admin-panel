import { useAuthStore } from '@/store/auth-store'
import { Button } from '@/components/ui/button'
import { LogOut, Ban } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function SuspendedPage() {
  const { t } = useTranslation()
  const logout = useAuthStore((state) => state.logout)
  const user = useAuthStore((state) => state.user)

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
            <Ban className="h-12 w-12 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl">
            {t('auth.suspended.title', 'Account Suspended')}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t('auth.suspended.message', 'Your account has been suspended by an administrator. Please contact support for assistance.')}
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
            <div className="flex flex-col gap-2 text-sm text-left">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('auth.suspended.account', 'Account')}:</span>
                    <span className="font-medium">{user?.email}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('auth.suspended.status', 'Status')}:</span>
                    <span className="font-medium text-destructive capitalize">{user?.status || 'suspended'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t mt-2">
                    <span className="text-muted-foreground">{t('auth.suspended.contactSupport', 'Contact Support')}:</span>
                    <a href="mailto:braivexa.company@gmail.com" className="font-medium text-primary hover:underline">
                        braivexa.company@gmail.com
                    </a>
                </div>
            </div>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" onClick={() => logout()} className="gap-2">
            <LogOut className="h-4 w-4" />
            {t('auth.logout', 'Sign out')}
          </Button>
        </div>
      </div>
    </div>
  )
}
