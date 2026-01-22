import { useState, useEffect, useCallback } from 'react'

export type ConnectionStatus = 'online' | 'offline' | 'server-down'

// Health check URL - use env variable or default
const HEALTH_CHECK_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/health`

interface UseConnectionStatusOptions {
    /** Interval in ms to check server health (default: 30000 = 30s) */
    healthCheckInterval?: number
    /** Whether to enable periodic health checks (default: true) */
    enableHealthCheck?: boolean
}

export interface ConnectionStatusResult {
    status: ConnectionStatus
    isOnline: boolean
    isServerAvailable: boolean
    isChecking: boolean
    lastChecked: Date | null
    checkServerHealth: () => Promise<boolean>
}

/**
 * Hook to monitor connection status (browser online + server availability)
 */
export function useConnectionStatus(options: UseConnectionStatusOptions = {}): ConnectionStatusResult {
    const { healthCheckInterval = 30000, enableHealthCheck = true } = options

    const [isOnline, setIsOnline] = useState(navigator.onLine)
    const [isServerAvailable, setIsServerAvailable] = useState(true)
    const [isChecking, setIsChecking] = useState(false)
    const [lastChecked, setLastChecked] = useState<Date | null>(null)

    const checkServerHealth = useCallback(async (): Promise<boolean> => {
        if (!navigator.onLine) {
            setIsServerAvailable(false)
            return false
        }

        setIsChecking(true)
        try {
            // Use simple fetch without credentials to avoid CORS preflight
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)

            const response = await fetch(HEALTH_CHECK_URL, {
                method: 'GET',
                signal: controller.signal,
                // Don't send credentials to avoid CORS complications
                credentials: 'omit',
                headers: {
                    'Accept': 'application/json',
                },
            })

            clearTimeout(timeoutId)
            const available = response.ok
            setIsServerAvailable(available)
            setLastChecked(new Date())
            return available
        } catch {
            setIsServerAvailable(false)
            setLastChecked(new Date())
            return false
        } finally {
            setIsChecking(false)
        }
    }, [])

    // Browser online/offline events
    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true)
            // Check server when coming back online
            checkServerHealth()
        }

        const handleOffline = () => {
            setIsOnline(false)
            setIsServerAvailable(false)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [checkServerHealth])

    // Initial server health check
    useEffect(() => {
        if (navigator.onLine) {
            checkServerHealth()
        }
    }, [checkServerHealth])

    // Periodic health check
    useEffect(() => {
        if (!enableHealthCheck || !navigator.onLine) return

        const interval = setInterval(() => {
            checkServerHealth()
        }, healthCheckInterval)

        return () => clearInterval(interval)
    }, [enableHealthCheck, healthCheckInterval, checkServerHealth])

    // Computed status
    const status: ConnectionStatus = !isOnline
        ? 'offline'
        : !isServerAvailable
            ? 'server-down'
            : 'online'

    return {
        status,
        isOnline,
        isServerAvailable,
        isChecking,
        lastChecked,
        checkServerHealth,
    }
}
