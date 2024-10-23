import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import e from 'express';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ValidationError } from 'sequelize';
import { SchemaValidationError } from 'src/pipes/ZodvalidationPipe';
import { ZodError } from 'zod';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<any> {
        return next.handle().pipe(
            map((data: any) => {
                // Customize the successful response format here
                const statusCode = context.switchToHttp().getResponse().statusCode;

                // Check if data is an array or an object
                let formattedData: any;
                let message = null;
                if (!Array.isArray(data)) {
                    message = data?.message;
                    delete data.message;
                    formattedData = { data };
                } else {
                    formattedData = data
                }

                const response = {
                    success: statusCode >= 200 && statusCode < 300,
                    statusCode: statusCode,
                    message,
                    ...formattedData, // Spread formatted data
                }

                return response;
            }),
            catchError((error) => {
                const response = context.switchToHttp().getResponse();
                const statusCode = error instanceof HttpException ? error.getStatus() : 500;
                let message = error.message;
                if (error instanceof SchemaValidationError) {
                    message = 'Validation failed';
                }

                // Format the error response
                const formattedErrorResponse: any = {
                    success: false,
                    statusCode: statusCode,
                    message,
                    data: {},
                };

                if (message) {
                    formattedErrorResponse.errors = error.formattedErrors;
                }

                // Send the formatted error response
                response.status(statusCode).json(formattedErrorResponse);
                return throwError(() => new InternalServerErrorException()); // Proper error handling in the application
            }),
        );
    }
}