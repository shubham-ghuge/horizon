import { config } from './env';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const levelPriority: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const envLevel = (process.env.LOG_LEVEL as LogLevel) || (config.NODE_ENV === 'production' ? 'info' : 'debug');

const supportsColor = Boolean(process.stdout.isTTY) && process.env.NO_COLOR !== '1' && config.NODE_ENV !== 'test';

const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  gray: '\x1b[90m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function paint(color: string, text: string): string {
  if (!supportsColor) return text;
  return `${color}${text}${colors.reset}`;
}

function colorForLevel(level: LogLevel): string {
  switch (level) {
    case 'error':
      return colors.red;
    case 'warn':
      return colors.yellow;
    case 'info':
      return colors.cyan;
    case 'debug':
    default:
      return colors.magenta;
  }
}

function colorForStatus(statusCode?: number): string {
  if (!statusCode) return colors.gray;
  if (statusCode >= 500) return colors.red;
  if (statusCode >= 400) return colors.yellow;
  if (statusCode >= 300) return colors.cyan;
  return colors.green;
}

function shouldLog(messageLevel: LogLevel): boolean {
  return levelPriority[messageLevel] <= levelPriority[envLevel];
}

function format(level: LogLevel, message: string, meta?: unknown): string {
  const ts = new Date().toISOString();
  const tsPart = paint(colors.gray, `[${ts}]`);
  const levelPart = paint(colorForLevel(level), `[${level.toUpperCase()}]`);
  const base = `${tsPart} ${levelPart} ${message}`;
  if (meta === undefined || meta === null) return base;
  try {
    if (meta instanceof Error) {
      const errObj = {
        name: meta.name,
        message: meta.message,
        stack: meta.stack,
      };
      return `${base} ${paint(colors.red, `| ${JSON.stringify(errObj)}`)}`;
    }
    if (typeof meta === 'object' && meta !== null) {
      const m = meta as Record<string, unknown>;
      const statusCode = typeof m.statusCode === 'number' ? (m.statusCode as number) : undefined;
      if (
        (m.method && m.url && statusCode) ||
        (m.method && m.originalUrl && statusCode)
      ) {
        const method = String(m.method || '');
        const url = String((m.url || m.originalUrl) ?? '');
        const duration = m.durationMs !== undefined ? ` ${String(m.durationMs)}ms` : '';
        const ip = m.ip ? ` ip=${String(m.ip)}` : '';
        const ua = m.userAgent ? ` ua="${String(m.userAgent)}"` : '';
        const statusColored = paint(colorForStatus(statusCode), String(statusCode));
        return `${base} | ${method} ${url} - ${statusColored}${duration}${paint(colors.gray, `${ip}${ua}`)}`;
      }
    }
    const serialized = typeof meta === 'string' ? meta : JSON.stringify(meta);
    return `${base} ${paint(colors.dim, `| ${serialized}`)}`;
  } catch {
    return base;
  }
}

export const logger = {
  error(message: string, meta?: unknown) {
    if (!shouldLog('error')) return;
    // eslint-disable-next-line no-console
    console.error(format('error', message, meta));
  },
  warn(message: string, meta?: unknown) {
    if (!shouldLog('warn')) return;
    // eslint-disable-next-line no-console
    console.warn(format('warn', message, meta));
  },
  info(message: string, meta?: unknown) {
    if (!shouldLog('info')) return;
    // eslint-disable-next-line no-console
    console.log(format('info', message, meta));
  },
  debug(message: string, meta?: unknown) {
    if (!shouldLog('debug')) return;
    // eslint-disable-next-line no-console
    console.log(format('debug', message, meta));
  },
};

export default logger;


