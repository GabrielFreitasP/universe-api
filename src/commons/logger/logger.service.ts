import * as winston from 'winston';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoggerService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: process.env.LOGGER_LEVEL || 'debug',
      format: winston.format.combine(
        winston.format.label({
          label: process.env.LOGGER_LABEL || 'development',
        }),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
          if (info.message['json']) {
            return JSON.stringify(info.message['json']);
          }

          return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
        }),
      ),
      transports: [new winston.transports.Console()],
    });
  }

  log(message: string, metadata: any = {}) {
    this.logger.info(message, metadata);
  }

  error(message: string, metadata: any = {}) {
    this.logger.error(message, metadata);
  }

  warn(message: string, metadata: any = {}) {
    this.logger.warn(message, metadata);
  }

  debug(message: string, metadata: any = {}) {
    this.logger.debug(message, metadata);
  }

  info(message: string, metadata: any = {}) {
    this.logger.info(message, metadata);
  }

  verbose(message: string, metadata: any = {}) {
    this.logger.verbose(message, metadata);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  json(json: object): void {
    this.logger.info({ json });
  }
}
