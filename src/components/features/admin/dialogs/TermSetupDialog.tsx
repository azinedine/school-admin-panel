import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface TermSetupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (startDate: string, endDate: string) => void
  existingStartDate?: string
  existingEndDate?: string
}

export function TermSetupDialog({
  open,
  onOpenChange,
  onSave,
  existingStartDate,
  existingEndDate,
}: TermSetupDialogProps) {
  const { t } = useTranslation()
  const [startDate, setStartDate] = useState(existingStartDate || '')
  const [endDate, setEndDate] = useState(existingEndDate || '')
  const [error, setError] = useState('')

  const handleSave = () => {
    // Validation
    if (!startDate || !endDate) {
      setError(t('pages.prep.termSetup.errors.required'))
      return
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      setError(t('pages.prep.termSetup.errors.invalidRange'))
      return
    }

    // Calculate weeks
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weekCount = Math.ceil(diffDays / 7)

    if (weekCount > 52) {
      setError(t('pages.prep.termSetup.errors.tooLong'))
      return
    }

    onSave(startDate, endDate)
    onOpenChange(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setError('')
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t('pages.prep.termSetup.title')}
          </DialogTitle>
          <DialogDescription>
            {t('pages.prep.termSetup.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Start Date */}
          <div className="grid gap-2">
            <Label htmlFor="start-date">
              {t('pages.prep.termSetup.startDate')} *
            </Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value)
                setError('')
              }}
            />
          </div>

          {/* End Date */}
          <div className="grid gap-2">
            <Label htmlFor="end-date">
              {t('pages.prep.termSetup.endDate')} *
            </Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value)
                setError('')
              }}
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Info Message */}
          {startDate && endDate && !error && (() => {
            const start = new Date(startDate)
            const end = new Date(endDate)
            if (start < end) {
              const diffTime = Math.abs(end.getTime() - start.getTime())
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
              const weekCount = Math.ceil(diffDays / 7)
              return (
                <p className="text-sm text-muted-foreground">
                  {t('pages.prep.termSetup.weekCount', { count: weekCount })}
                </p>
              )
            }
            return null
          })()}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            disabled={!startDate || !endDate}
          >
            {t('common.save')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
