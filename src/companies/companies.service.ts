import { Injectable, NotFoundException } from '@nestjs/common';

import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { DataService } from 'src/common/repository/data-service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import { FindManyOptions } from 'typeorm';

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
    };

    return this.dataService.companies.findAll(options);
  }

  async findOne(id: number): Promise<Company> {
    const options = {
      where: { id },
    };

    const company = await this.dataService.companies.findOne(options);

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return company;
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.dataService.companies.save({
      ...createCompanyDto,
      charging_stations: await this.resolveAllChargingStations(
        createCompanyDto,
      ),
    });

    return company;
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const charging_stations =
      updateCompanyDto.charging_stations &&
      (await this.resolveAllChargingStations(updateCompanyDto));

    const company = await this.dataService.companies.preload({
      id,
      ...updateCompanyDto,
      charging_stations,
    });

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return this.dataService.companies.save(company);
  }

  async remove(id: number) {
    const company = await this.findOne(id);
    return this.dataService.companies.remove(company);
  }

  private async resolveAllChargingStations(
    actionCompanyDto: CreateCompanyDto | UpdateCompanyDto,
  ): Promise<ChargingStation[]> {
    const chargingStations: ChargingStation[] =
      actionCompanyDto.charging_stations.reduce(
        (chargingStations, chargingStation) => {
          const station = this.preloadChargingStation(chargingStation);
          chargingStations.push(station);

          return chargingStations;
        },
        [],
      );

    return await Promise.all(chargingStations);
  }

  private async preloadChargingStation(
    chargingStation: ChargingStation,
  ): Promise<ChargingStation> {
    const existingChargingStation =
      await this.dataService.chargingStations.findOne({
        where: { name: chargingStation.name },
      });

    if (existingChargingStation) {
      return existingChargingStation;
    }

    return this.dataService.chargingStations.create({ ...chargingStation });
  }
}
