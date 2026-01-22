import { WifiOff, ServerOff, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/ui/language-switcher'
import type { ConnectionStatus } from '@/hooks/use-connection-status'

interface NoConnectionProps {
    /** Type of connection issue */
    type?: ConnectionStatus
    /** Callback when retry button is clicked */
    onRetry?: () => void
    /** Whether a retry/health check is in progress */
    isRetrying?: boolean
}

/**
 * Full-screen component displayed when there's no connection
 * Handles both browser offline and server unavailable states
 */
export function NoConnection({ type = 'offline', onRetry, isRetrying = false }: NoConnectionProps) {
    const { t } = useTranslation()

    const handleRetry = () => {
        if (onRetry) {
            onRetry()
        } else {
            window.location.reload()
        }
    }

    const isOffline = type === 'offline'
    const Icon = isOffline ? WifiOff : ServerOff

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative">
            {/* Language Switcher */}
            <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
                <LanguageSwitcher />
            </div>

            <div className="flex flex-col items-center gap-6 text-center max-w-md mx-auto">
                {/* Icon */}
                <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="h-12 w-12 text-muted-foreground" />
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                        {isOffline
                            ? t('common.noInternet')
                            : t('common.serverUnavailable', 'Server Unavailable')}
                    </h1>
                    <p className="text-muted-foreground">
                        {isOffline
                            ? t('common.checkConnection')
                            : t('common.serverUnavailableDesc', 'We cannot reach the server. Please try again later.')}
                    </p>
                </div>

                {/* Tips Card */}
                <div className="bg-card border rounded-lg p-4 w-full text-left">
                    <h3 className="font-medium mb-2 text-sm">
                        {t('common.troubleshooting', 'Troubleshooting Tips')}:
                    </h3>
                    <ul className="text-sm text-muted-foreground space-y-1.5 list-disc list-inside">
                        {isOffline ? (
                            <>
                                <li>{t('common.tip.checkWifi', 'Check your Wi-Fi or mobile data connection')}</li>
                                <li>{t('common.tip.restartRouter', 'Try restarting your router')}</li>
                                <li>{t('common.tip.airplaneMode', 'Make sure airplane mode is off')}</li>
                            </>
                        ) : (
                            <>
                                <li>{t('common.tip.serverMaintenance', 'The server may be under maintenance')}</li>
                                <li>{t('common.tip.waitAndRetry', 'Wait a few moments and try again')}</li>
                                <li>{t('common.tip.contactSupport', 'Contact support if the issue persists')}</li>
                            </>
                        )}
                    </ul>
                </div>

                {/* Retry Button */}
                <Button
                    onClick={handleRetry}
                    disabled={isRetrying}
                    className="gap-2"
                    size="lg"
                >
                    <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                    {isRetrying
                        ? t('common.checking', 'Checking...')
                        : t('common.retry')}
                </Button>
            </div>
        </div>
    )
}

// Keep backward compatibility with old component name
export const NoInternet = NoConnection
