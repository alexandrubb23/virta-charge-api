import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { ApiKeyGuard } from './guards/api-key/api-key.guard';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { DataServiceModule } from './repository/data-service.module';

@Module({
  imports: [ConfigModule, DataServiceModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
