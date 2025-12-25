import { useTranslation } from 'react-i18next'
import { AlertCircle } from 'lucide-react'
import type { User } from '@/store/types'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface ConfirmDeleteDialogProps {
  user: User | null
  isOpen: boolean
  isLoading: boolean
  onConfirm: () => void
  onCancel: () => void
}

/**
 * ConfirmDeleteDialog Component
 * 
 * Displays a confirmation dialog for permanently deleting a user account.
 * Shows destructive warning and requires confirmation before proceeding.
 */
export function ConfirmDeleteDialog({
  user,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: ConfirmDeleteDialogProps) {
  const { t } = useTranslation()

  if (!user) return null

  return (
    <AlertDialog open={isOpen} onOpenChange={onCancel}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertDialogTitle>{t('pages.users.deleteAccount.title')}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3">
            <p>{t('pages.users.deleteAccount.description')}</p>
            <p className="font-semibold text-destructive">{t('pages.users.deleteAccount.warning')}</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t('pages.users.deleteAccount.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? `${t('common.processing')}...` : t('pages.users.deleteAccount.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
