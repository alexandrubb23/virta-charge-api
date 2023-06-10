import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

import { CompaniesService } from '../companies.service';
import { Company } from '../entities/company.entity';
import { companiesWithChargingStations } from '../utils/companiesWithChargingStations';

@Injectable()
class CompanyChargingStationsInterceptor implements NestInterceptor {
  constructor(private readonly companiesService: CompaniesService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (company: Company) => {
        const allCompanies = await this.companiesService.findAll();

        const companies = companiesWithChargingStations(allCompanies);
        const findCompany = companies.find((c) => c.id === company.id);

        return findCompany;
      }),
    );
  }
}

export default CompanyChargingStationsInterceptor;
