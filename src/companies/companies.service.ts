import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ChargingStations } from './entities/charging-stations.entity';
import { Company } from './entities/company.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(ChargingStations)
    private readonly chargingStationsRepository: Repository<ChargingStations>,
  ) {}

  findAll(): Promise<Company[]> {
    return this.companyRepository.find({
      relations: {
        charging_stations: true,
      },
    });
  }

  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id },
      relations: {
        charging_stations: true,
      },
    });

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return company;
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const company = this.companyRepository.create({
      ...createCompanyDto,
      charging_stations: await this.resolveAllChargingStations(
        createCompanyDto,
      ),
    });

    return this.companyRepository.save(company);
  }

  async update(
    id: number,
    updateCompanyDto: UpdateCompanyDto,
  ): Promise<Company> {
    const charging_stations =
      updateCompanyDto.charging_stations &&
      (await this.resolveAllChargingStations(updateCompanyDto));

    const company = await this.companyRepository.preload({
      id,
      ...updateCompanyDto,
      charging_stations,
    });

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }

    return this.companyRepository.save(company);
  }

  async remove(id: number) {
    const company = await this.findOne(id);
    return this.companyRepository.remove(company);
  }

  private async resolveAllChargingStations(
    actionCompanyDto: CreateCompanyDto | UpdateCompanyDto,
  ): Promise<ChargingStations[]> {
    const chargingStations: ChargingStations[] =
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
    chargingStation: ChargingStations,
  ): Promise<ChargingStations> {
    const existingChargingStation =
      await this.chargingStationsRepository.findOne({
        where: { name: chargingStation.name },
      });

    if (existingChargingStation) {
      return existingChargingStation;
    }

    return this.chargingStationsRepository.create({ ...chargingStation });
  }
}
