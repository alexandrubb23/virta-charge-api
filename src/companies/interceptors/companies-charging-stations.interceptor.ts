import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { Company } from '../entities/company.entity';
import { CompaniesWithChargingStations } from '../utils/companiesWithChargingStations';

@Injectable()
class CompaniesChargingStationsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((companies: Company[]) => {
        return CompaniesWithChargingStations.getInstance().traverseCompanies(
          companies,
        );
      }),
    );
  }
}

export default CompaniesChargingStationsInterceptor;
