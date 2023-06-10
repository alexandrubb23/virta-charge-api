import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Observable,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const timeoutRequest = this.configService.get(
      'API_REQUEST_TIMEOUT',
      10000,
    ) as number;

    return next.handle().pipe(
      timeout(+timeoutRequest),
      catchError((error) => {
        return throwError(() =>
          error instanceof TimeoutError ? new RequestTimeoutException() : error,
        );
      }),
    );
  }
}
