import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { useTranslation } from 'react-i18next'

interface FullScreenLoaderProps {
  message?: string
}

export function FullScreenLoader({ message }: FullScreenLoaderProps) {
  const { t } = useTranslation()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <div className="space-y-2 text-center">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-3 w-24 mx-auto" />
        </div>
        <p className="text-muted-foreground text-sm">
          {message || t('common.processing')}
        </p>
      </div>
    </div>
  )
}
