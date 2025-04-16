class Logger {
  private isClient = typeof window !== 'undefined'

  private storeLog(logEntry: any) {
    if (!this.isClient) return // Skip storage on server-side

    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]')
      logs.push(logEntry)
      // Keep only last 1000 logs
      while (logs.length > 1000) logs.shift()
      localStorage.setItem('app_logs', JSON.stringify(logs))
    } catch (error) {
      console.error('Failed to store log:', error)
    }
  }

  private styles = {
    log: 'background: #2563eb; color: white; padding: 2px 6px; border-radius: 4px;',
    info: 'background: #059669; color: white; padding: 2px 6px; border-radius: 4px;',
    warn: 'background: #d97706; color: white; padding: 2px 6px; border-radius: 4px;',
    error: 'background: #dc2626; color: white; padding: 2px 6px; border-radius: 4px;'
  }

  log(context: string, message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logPrefix = `[${timestamp}] [${context}]`
    
    if (this.isClient) {
      console.log(
        `%c${logPrefix}%c ${message}`,
        this.styles.log,
        'color: #2563eb;',
        data ? data : ''
      )
    } else {
      console.log(`${logPrefix} ${message}`, data || '')
    }

    this.storeLog({
      level: 'log',
      context,
      message,
      data,
      timestamp
    })
  }

  error(context: string, message: string, error?: any) {
    const timestamp = new Date().toISOString()
    const logPrefix = `[${timestamp}] [${context}]`
    
    if (this.isClient) {
      console.error(
        `%c${logPrefix}%c ${message}`,
        this.styles.error,
        'color: #dc2626;',
        error ? error : ''
      )
    } else {
      console.error(`${logPrefix} ${message}`, error || '')
    }

    this.storeLog({
      level: 'error',
      context,
      message,
      error,
      timestamp
    })
  }

  warn(context: string, message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logPrefix = `[${timestamp}] [${context}]`
    
    if (this.isClient) {
      console.warn(
        `%c${logPrefix}%c ${message}`,
        this.styles.warn,
        'color: #d97706;',
        data ? data : ''
      )
    } else {
      console.warn(`${logPrefix} ${message}`, data || '')
    }

    this.storeLog({
      level: 'warn',
      context,
      message,
      data,
      timestamp
    })
  }

  info(context: string, message: string, data?: any) {
    const timestamp = new Date().toISOString()
    const logPrefix = `[${timestamp}] [${context}]`
    
    if (this.isClient) {
      console.info(
        `%c${logPrefix}%c ${message}`,
        this.styles.info,
        'color: #059669;',
        data ? data : ''
      )
    } else {
      console.info(`${logPrefix} ${message}`, data || '')
    }

    this.storeLog({
      level: 'info',
      context,
      message,
      data,
      timestamp
    })
  }

  getLogs() {
    if (!this.isClient) return []
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]')
    } catch {
      return []
    }
  }

  clearLogs() {
    if (!this.isClient) return
    try {
      localStorage.removeItem('app_logs')
    } catch (error) {
      console.error('Failed to clear logs:', error)
    }
  }
}

export const logger = new Logger() 