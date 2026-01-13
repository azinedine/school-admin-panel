import { Calendar } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { useTermSetup } from './hooks/use-term-setup'
import { TermSetupForm } from './components/TermSetupForm'
import { TermSetupFooter } from './components/TermSetupFooter'

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
  const {
    t,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    error,
    setError,
    handleSave,
    handleOpenChange,
    weekCount
  } = useTermSetup({
    onOpenChange,
    onSave,
    existingStartDate,
    existingEndDate
  })

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

        <TermSetupForm
          t={t}
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={(val) => {
            setStartDate(val)
            setError('')
          }}
          onEndDateChange={(val) => {
            setEndDate(val)
            setError('')
          }}
          error={error}
          weekCount={weekCount}
        />

        <TermSetupFooter
          t={t}
          onCancel={() => handleOpenChange(false)}
          onSave={handleSave}
          isValid={!!startDate && !!endDate}
        />
      </DialogContent>
    </Dialog>
  )
}
