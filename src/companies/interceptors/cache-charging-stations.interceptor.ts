import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { CompaniesWithChargingStations } from '../utils/companiesWithChargingStations';
import { Company } from '../entities/company.entity';

@Injectable()
class ClearCompaniesCacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((company: Company[]) => {
        CompaniesWithChargingStations.getInstance().clearCache();

        return company;
      }),
    );
  }
}

export default ClearCompaniesCacheInterceptor;
