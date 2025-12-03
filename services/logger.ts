
// Centralized logging service to prevent raw stack trace exposure
// In a production environment, this would transport logs to a secure backend (e.g., Datadog, Splunk)

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

class Logger {
  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level}] NexusTrader: ${message}`;
  }

  info(message: string, meta?: any) {
    console.log(this.formatMessage('INFO', message), meta || '');
  }

  warn(message: string, meta?: any) {
    console.warn(this.formatMessage('WARN', message), meta || '');
  }

  error(message: string, error?: any) {
    // Security Fix: Do not expose full error objects/stack traces to the browser console in production
    // We log a generic message and a sanitized error code or message
    const safeError = error instanceof Error ? error.message : 'Unknown error';
    console.error(this.formatMessage('ERROR', message), { reason: safeError });
  }
}

export const logger = new Logger();
