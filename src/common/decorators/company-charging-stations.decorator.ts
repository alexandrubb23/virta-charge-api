import { SetMetadata, UseInterceptors } from '@nestjs/common';

import { CompanyChargingStationsInterceptor } from 'src/companies/interceptors';

export const AddCompanyChargingStations =
  (): MethodDecorator =>
  (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    SetMetadata('companyChargingStations', true)(target, key, descriptor);
    UseInterceptors(CompanyChargingStationsInterceptor)(
      target,
      key,
      descriptor,
    );
  };
