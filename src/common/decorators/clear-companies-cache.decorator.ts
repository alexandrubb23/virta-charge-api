import { SetMetadata, UseInterceptors } from '@nestjs/common';
import ClearCompaniesCacheInterceptor from 'src/companies/interceptors/cache-charging-stations.interceptor';

export const ClearCompaniesCacheOnAfter =
  (): MethodDecorator =>
  (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    SetMetadata('clearCache', true)(target, key, descriptor);
    UseInterceptors(ClearCompaniesCacheInterceptor)(target, key, descriptor);
  };
