import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AlertTriangle } from 'lucide-react'

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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useDeleteAccount } from '@/hooks/use-auth'

interface DeleteAccountDialogProps {
  isOpen: boolean
  onClose: () => void
  userEmail: string
}

export function DeleteAccountDialog({ isOpen, onClose, userEmail }: DeleteAccountDialogProps) {
  const { t } = useTranslation()
  const [confirmText, setConfirmText] = useState('')
  const { mutate: deleteAccount, isPending } = useDeleteAccount()

  const isConfirmed = confirmText === 'DELETE'

  const handleDelete = () => {
    if (isConfirmed) {
      deleteAccount()
    }
  }

  const handleClose = () => {
    setConfirmText('')
    onClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <AlertDialogTitle className="text-destructive">
              {t('profilePage.deleteAccount', 'Delete Account')}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-3 pt-2">
            <p>
              {t('profilePage.deleteAccountWarning', 'This action cannot be undone. This will permanently delete your account and remove all your data from our servers.')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('profilePage.accountToDelete', 'Account')}: <strong>{userEmail}</strong>
            </p>
            <div className="space-y-2 pt-2">
              <Label htmlFor="confirm-delete" className="text-sm font-medium">
                {t('profilePage.typeDeleteToConfirm', 'Type DELETE to confirm')}
              </Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                placeholder="DELETE"
                className="font-mono"
                autoComplete="off"
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={!isConfirmed || isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? t('common.deleting', 'Deleting...') : t('profilePage.deleteAccount', 'Delete Account')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
