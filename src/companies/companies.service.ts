import { Injectable } from '@nestjs/common';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  private companies: Company[] = [
    {
      id: 1,
      name: 'Company 1',
      parent_company_id: 0,
      children: [],
      charging_stations: ['station 1', 'station2'],
    },
  ];

  findAll(): Company[] {
    return this.companies;
  }

  findOne(id: string): Company {
    return this.companies.find((company) => company.id === +id);
  }

  create(companyDto: Company): Company {
    this.companies.push(companyDto);
    return companyDto;
  }

  update(id: string, companyDto: Company): Company {
    const existingCompany = this.findOne(id);
    if (existingCompany) {
      // update the existing entity
    }

    return companyDto;
  }

  remove(id: string) {
    const companyIndex = this.companies.findIndex(
      (company) => company.id === +id,
    );

    if (companyIndex >= 0) {
      this.companies.splice(companyIndex, 1);
    }
  }
}
