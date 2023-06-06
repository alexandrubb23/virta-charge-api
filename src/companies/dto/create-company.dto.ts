import { Company } from '../entities/company.entity';

export class CreateCompanyDto {
  readonly name: string;
  readonly parent_company_id: number;
  readonly children: Company[];
  readonly charging_stations: string[];
}
