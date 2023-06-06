import { Company } from 'src/companies/entities/company.entity';

export class UpdateCompanyDto {
  readonly name?: string;
  readonly parent_company_id?: number;
  readonly children?: Company[];
  readonly charging_stations?: string[];
}
