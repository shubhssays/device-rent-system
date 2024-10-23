import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class BadRequestExceptionFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as any;

        response.status(status).json({
            success: false,
            statusCode: status,
            message: exceptionResponse.message || 'Bad Request',
            errors: exceptionResponse.errors || null,
            data: null,
        });
    }
}