import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(
        context: ExecutionContext,
        next: CallHandler<T>,
    ): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                // Customize the response format here
                const statusCode = context.switchToHttp().getResponse().statusCode;
                return {
                    success: statusCode >= 200 && statusCode < 300,
                    statusCode: statusCode,
                    data: data || {},
                };
            }),
        );
    }
}
