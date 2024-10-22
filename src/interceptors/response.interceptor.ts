import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    HttpException,
    InternalServerErrorException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                // Customize the successful response format here
                const statusCode = context.switchToHttp().getResponse().statusCode;

                // Check if data is an array or an object
                const formattedData = Array.isArray(data) ? data : { data };

                return {
                    success: statusCode >= 200 && statusCode < 300,
                    statusCode: statusCode,
                    ...formattedData, // Spread formatted data
                };
            }),
            catchError((error) => {
                const response = context.switchToHttp().getResponse();
                const statusCode = error instanceof HttpException ? error.getStatus() : 500;

                // Format the error response
                const formattedErrorResponse = {
                    success: false,
                    statusCode: statusCode,
                    data: {
                        message: error.message || 'Internal Server Error', // Default error message
                    },
                };

                // Send the formatted error response
                response.status(statusCode).json(formattedErrorResponse);
                return throwError(() => new InternalServerErrorException()); // Proper error handling in the application
            }),
        );
    }
}