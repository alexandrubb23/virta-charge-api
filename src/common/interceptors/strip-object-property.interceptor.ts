import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class StripObjectPropertyInterceptor implements NestInterceptor {
  constructor(private readonly propertyToRemove: string) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        if (Array.isArray(response)) {
          return response.map((item) => this.stripProperty(item));
        }

        return this.stripProperty(response);
      }),
    );
  }

  private stripProperty(response: any): any {
    if (
      response &&
      Object.hasOwnProperty.call(response, this.propertyToRemove)
    ) {
      const { [this.propertyToRemove]: _, ...rest } = response;

      return rest;
    }

    return response;
  }
}
