import { SetMetadata, UseInterceptors } from '@nestjs/common';

import { CompaniesChargingStationsInterceptor } from 'src/companies/interceptors';

export const AddCompaniesChargingStations =
  (): MethodDecorator =>
  (target: any, key: string | symbol, descriptor: PropertyDescriptor) => {
    SetMetadata('companiesChargingStations', true)(target, key, descriptor);
    UseInterceptors(CompaniesChargingStationsInterceptor)(
      target,
      key,
      descriptor,
    );
  };
