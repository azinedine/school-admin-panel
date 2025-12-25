import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertCircle, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuthStore } from '@/store/auth-store'
import { useUsersManagement } from '@/hooks/use-users-management'
import { ContentPage } from '@/components/layout/content-page'
import { UsersTable } from '@/components/users/users-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

/**
 * UsersManagementPage Component
 * 
 * Main page for managing all registered users in the platform.
 * Features:
 * - Role-based access control (only admin, manager, super_admin)
 * - Paginated user list display
 * - User details view in a sidebar sheet (handled by UsersTable)
 * - Suspend and delete user actions (handled by UsersTable)
 * - Toast notifications for success/error states
 * - Loading and error states
 * - Full i18n support
 * - Consistent UI with existing dashboard
 */
export function UsersManagementPage() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const [currentPage, setCurrentPage] = useState(1)

  // Check role-based access
  const allowedRoles = ['admin', 'manager', 'super_admin']
  const hasAccess = user && allowedRoles.includes(user.role)

  const { isLoading, error, users, meta, isPending } = useUsersManagement({
    page: currentPage,
    limit: 10,
  })

  if (!hasAccess) {
    return (
      <ContentPage
        title={t('pages.users.title')}
        description={t('pages.users.description')}
      >
        <div className="flex items-center justify-center min-h-[40vh]">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <div className="space-y-2">
              <h3 className="font-semibold">{t('pages.users.accessDenied')}</h3>
              <AlertDescription>
                {t('pages.users.accessDeniedMessage')}
              </AlertDescription>
            </div>
          </Alert>
        </div>
      </ContentPage>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <ContentPage
        title={t('pages.users.title')}
        description={t('pages.users.description')}
      >
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
              <p className="text-muted-foreground">{t('pages.users.loading')}</p>
            </div>
          </CardContent>
        </Card>
      </ContentPage>
    )
  }

  // Error state
  if (error) {
    return (
      <ContentPage
        title={t('pages.users.title')}
        description={t('pages.users.description')}
      >
        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <div className="space-y-2">
              <h3 className="font-semibold">{t('pages.users.error')}</h3>
              <AlertDescription>
                {error instanceof Error ? error.message : t('pages.users.error')}
              </AlertDescription>
            </div>
          </Alert>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="gap-2"
          >
            <RotateCw className="h-4 w-4" />
            {t('pages.users.retry')}
          </Button>
        </div>
      </ContentPage>
    )
  }

  // No results state
  if (!isPending && (!users || users.length === 0)) {
    return (
      <ContentPage
        title={t('pages.users.title')}
        description={t('pages.users.description')}
      >
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">{t('pages.users.noResults')}</p>
            </div>
          </CardContent>
        </Card>
      </ContentPage>
    )
  }

  // Main content with pagination
  return (
    <ContentPage
      title={t('pages.users.title')}
      description={t('pages.users.description')}
    >
      <div className="space-y-6">
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('pages.users.totalUsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {meta?.total ?? 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {t('pages.users.activeUsers')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.filter(u => u.status === 'active' || !u.status).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('pages.users.table.name')}</CardTitle>
            <CardDescription>
              {meta && t('pages.users.pagination.showing', {
                from: meta.from || 0,
                to: meta.to || 0,
                total: meta.total || 0,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <UsersTable 
              data={users} 
              isLoading={isPending}
            />

            {/* Pagination controls */}
            {meta && meta.last_page > 1 && (
              <div className="flex items-center justify-between gap-4 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  {t('pages.users.pagination.previous')}
                </Button>

                <div className="flex gap-2">
                  {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(meta.last_page, p + 1))}
                  disabled={currentPage === meta.last_page}
                  className="gap-2"
                >
                  {t('pages.users.pagination.next')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </ContentPage>
  )
}
