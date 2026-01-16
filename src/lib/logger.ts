/**
 * Application Logger
 * 
 * Centralized logging utility for the application.
 * In production, this can be extended to send logs to a service like Sentry, LogRocket, etc.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

interface LogEntry {
  level: LogLevel
  message: string
  context?: string
  data?: unknown
  timestamp: string
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development'

  /**
   * Log an informational message
   */
  info(message: string, context?: string, data?: unknown): void {
    this.log('info', message, context, data)
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: string, data?: unknown): void {
    this.log('warn', message, context, data)
  }

  /**
   * Log an error message
   */
  error(message: string, context?: string, error?: unknown): void {
    this.log('error', message, context, error)
    
    // In production, send to error tracking service
    if (!this.isDevelopment) {
      this.sendToErrorTracking(message, context, error)
    }
  }

  /**
   * Log a debug message (only in development)
   */
  debug(message: string, context?: string, data?: unknown): void {
    if (this.isDevelopment) {
      this.log('debug', message, context, data)
    }
  }

  /**
   * Internal log method
   */
  private log(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      context,
      data,
      timestamp: new Date().toISOString(),
    }

    const prefix = context ? `[${context}]` : ''
    const formattedMessage = `${prefix} ${message}`

    switch (level) {
      case 'info':
        console.info(formattedMessage, data || '')
        break
      case 'warn':
        console.warn(formattedMessage, data || '')
        break
      case 'error':
        console.error(formattedMessage, data || '')
        break
      case 'debug':
        console.debug(formattedMessage, data || '')
        break
    }

    // Store in session storage for debugging (last 100 entries)
    if (this.isDevelopment) {
      this.storeLogEntry(entry)
    }
  }

  /**
   * Store log entry in session storage
   */
  private storeLogEntry(entry: LogEntry): void {
    try {
      const key = 'app_logs'
      const stored = sessionStorage.getItem(key)
      const logs: LogEntry[] = stored ? JSON.parse(stored) : []
      
      logs.push(entry)
      
      // Keep only last 100 entries
      if (logs.length > 100) {
        logs.shift()
      }
      
      sessionStorage.setItem(key, JSON.stringify(logs))
    } catch {
      // Silently fail if storage is not available
    }
  }

  /**
   * Send error to tracking service (placeholder for production)
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private sendToErrorTracking(_message: string, _context?: string, _error?: unknown): void {
    // TODO: Integrate with error tracking service (Sentry, LogRocket, etc.)
    // Example:
    // Sentry.captureException(_error, {
    //   tags: { context: _context },
    //   extra: { message: _message }
    // })
  }

  /**
   * Get stored logs (for debugging)
   */
  getLogs(): LogEntry[] {
    try {
      const stored = sessionStorage.getItem('app_logs')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  /**
   * Clear stored logs
   */
  clearLogs(): void {
    try {
      sessionStorage.removeItem('app_logs')
    } catch {
      // Silently fail
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export for debugging in console
if (typeof window !== 'undefined') {
  (window as unknown as { logger: Logger }).logger = logger
}
