import { Injectable, NotFoundException } from '@nestjs/common';

import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { DataService } from 'src/common/repository/data-service';
import { FindManyOptions } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(private readonly dataService: DataService) {}

  async findAll(paginationQuery?: PaginationQueryDto): Promise<Company[]> {
    const { limit, offset } = paginationQuery || {};

    const options: FindManyOptions = {
      relations: {
        charging_stations: true,
      },
      skip: offset,
      take: limit,
      order: {
        id: 'ASC',
      },
    };

    return this.dataService.companies.findAll(options);
  }

  async findOne(id: number): Promise<Company> {
    const options = {
      where: { id },
      relations: {
        charging_stations: true,
      },
    };

    const company = await this.dataService.companies.findOne(options);

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return company;
  }

  create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    return this.dataService.companies.save({
      ...createCompanyDto,
      charging_stations: [],
    });
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const company = await this.dataService.companies.preload({
      id,
      ...updateCompanyDto,
    });

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return this.dataService.companies.save(company);
  }

  async remove(id: number) {
    const company = await this.findOne(id);

    // TODO: Should we use transaction here?
    const removeCompany = await this.dataService.companies.remove(company);
    await this.removeMultipleChargingStations(company.charging_stations);

    return removeCompany;
  }

  private async removeMultipleChargingStations(
    chargingStations: ChargingStation[],
  ) {
    // TODO: There must be a better way to do this.
    // Cascade delete maybe?
    for (const chargingStation of chargingStations) {
      await this.dataService.chargingStations.remove(chargingStation);
    }
  }
}
