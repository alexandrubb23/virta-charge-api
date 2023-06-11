import { UseInterceptors } from '@nestjs/common';

import { StripObjectPropertyInterceptor } from '../interceptors/strip-object-property.interceptor';

export const StripPropertyOnResponse = (propertyToRemove: string) =>
  UseInterceptors(new StripObjectPropertyInterceptor(propertyToRemove));
