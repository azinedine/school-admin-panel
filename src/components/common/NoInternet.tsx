import { WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

interface NoInternetProps {
    onRetry?: () => void
}

export const NoInternet = ({ onRetry }: NoInternetProps) => {
    const { t } = useTranslation()

    const handleRetry = () => {
        if (onRetry) {
            onRetry()
        } else {
            window.location.reload()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-4 text-center p-6 bg-card rounded-lg border shadow-lg max-w-sm mx-4">
                <div className="p-3 bg-muted rounded-full">
                    <WifiOff className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight">{t('common.noInternet')}</h2>
                    <p className="text-sm text-muted-foreground">
                        {t('common.checkConnection')}
                    </p>
                </div>
                <Button onClick={handleRetry} variant="outline">
                    {t('common.retry')}
                </Button>
            </div>
        </div>
    )
}
