// src/logger/logger.service.ts
import { Injectable, LoggerService } from '@nestjs/common';
import { transports, format, createLogger } from 'winston';

@Injectable()
export class MyLogger implements LoggerService {
    private logger;

    constructor() {
        this.logger = createLogger({
            level: 'info', // Default log level
            format: format.combine(
                format.timestamp(),
                format.json(),
            ),
            transports: [
                new transports.Console({
                    format: format.combine(
                        format.colorize(),
                        format.simple()
                    ),
                }),
                new transports.File({
                    filename: 'logs/error.log',
                    level: 'error',
                }),
                new transports.File({
                    filename: 'logs/combined.log',
                }),
            ],
        });
    }

    log(message: string) {
        this.logger.info(message);
    }

    error(message: string, trace: string) {
        this.logger.error(message, { trace });
    }

    warn(message: string) {
        this.logger.warn(message);
    }

    debug(message: string) {
        this.logger.debug(message);
    }

    verbose(message: string) {
        this.logger.verbose(message);
    }
}
