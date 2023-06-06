import { Injectable } from '@nestjs/common';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  private companies: Company[] = [
    {
      id: 1,
      name: 'Company 1',
      parent_company_id: 0,
      charging_stations: ['station 1', 'station2'],
    },
  ];

  findAll(): Company[] {
    return this.companies;
  }

  findOne(id: string): Company {
    return this.companies.find((company) => company.id === +id);
  }

  create(createCompanyDto: CreateCompanyDto): any {
    this.companies.push(createCompanyDto);
    return createCompanyDto;
  }

  update(id: string, companyDto: UpdateCompanyDto): any {
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
