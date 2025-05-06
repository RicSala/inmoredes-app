/* eslint-disable no-console */

type LogLevel = 'info' | 'error' | 'warn' | 'trace';

const colors = {
  info: '\x1b[34m', // blue
  error: '\x1b[31m', // red
  warn: '\x1b[33m', // yellow
  trace: '\x1b[36m', // cyan
  reset: '\x1b[0m',
} as const;

export function createLogger(scope: string) {
  const timers: Record<string, number> = {};

  const formatMessage = (level: LogLevel, message: string, args: unknown[]) => {
    const formattedArgs = args
      .map((arg) =>
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      )
      .join(' ');

    const msg = `[${scope}]: ${message} ${formattedArgs}`;

    if (process.env.NODE_ENV === 'development')
      return `${colors[level]}${msg}${colors.reset}`;
    return msg;
  };

  return {
    info: (message: string, ...args: unknown[]) =>
      console.log(formatMessage('info', message, args)),

    error: (message: string, ...args: unknown[]) =>
      console.error(formatMessage('error', message, args)),

    warn: (message: string, ...args: unknown[]) =>
      console.warn(formatMessage('warn', message, args)),

    trace: (message: string, ...args: unknown[]) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(formatMessage('trace', message, args));
      }
    },

    time: (label: string) => {
      timers[label] = Date.now();
    },

    timeEnd: (label: string) => {
      const startTime = timers[label];
      if (startTime) {
        const duration = Date.now() - startTime;
        console.log(formatMessage('info', `${label}: ${duration}ms`, []));
        delete timers[label];
      } else {
        console.warn(formatMessage('warn', `No such label: ${label}`, []));
      }
    },
  };
}

export type TLogger = ReturnType<typeof createLogger>;
