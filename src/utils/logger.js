import { createLogger, format, transports } from 'winston';

const {
  combine, timestamp, printf,
} = format;

const logFormat = printf(info => `${info.timestamp} ${info.message}`);

const logger = createLogger({
  transports: [new transports.Console({
    level: (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'preprod') ? 'silly' : 'error',
  })],
  format: combine(
    format.splat(),
    format.colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat,
  ),
});

module.exports = logger;
