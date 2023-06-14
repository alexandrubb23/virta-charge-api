import { Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, FindOneOptions } from 'typeorm';

import { DataService } from 'src/common/repository/data-service';
import { CompaniesService } from 'src/companies/companies.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { ChargingStation } from './entities/charging-station.entity';
import { SaveChargingStationInterface } from './models/charging-station.interface';

@Injectable()
export class ChargingStationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly dataService: DataService,
    private readonly companyService: CompaniesService,
  ) {}

  findAll(): Promise<ChargingStation[]> {
    return this.dataService.chargingStations.findAll();
  }

  async findOne(id: number): Promise<ChargingStation> {
    const options: FindOneOptions<ChargingStation> = {
      where: { id },
      relations: {
        company: true,
      },
    };

    const chargingStation = await this.dataService.chargingStations.findOne(
      options,
    );

    if (!chargingStation) {
      throw new NotFoundException(`Charging Station #${id} not found`);
    }

    return chargingStation;
  }

  async findNearbyChargingStations({
    latitude,
    longitude,
    radius,
    company_id,
  }): Promise<ChargingStation[]> {
    return this.dataService.chargingStations.findNearbyChargingStations({
      latitude,
      longitude,
      radius,
      company_id,
    });
  }

  async create(
    createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    const company = await this.companyService.findOne(
      createChargingStationDto.company_id,
    );
    const chargingStation = await this.dataService.chargingStations.create(
      createChargingStationDto,
    );

    company.charging_stations.push(chargingStation);

    await this.saveChargingStationAndCompany({ chargingStation, company });

    return chargingStation;
  }

  async update(id: number, updateChargingStationDto: UpdateChargingStationDto) {
    const { company_id } = updateChargingStationDto;

    const company = await this.companyService.findOne(company_id);
    const chargingStation = await this.findOne(id);

    const newChargingStation = {
      ...chargingStation,
      ...updateChargingStationDto,
    };

    const updatedChargingStation = await this.dataService.chargingStations.save(
      newChargingStation,
    );

    company.charging_stations.push(updatedChargingStation);

    await this.companyService.update(company_id, company);

    return updatedChargingStation;
  }

  async remove(id: number): Promise<ChargingStation> {
    const chargingStation = await this.findOne(id);

    await this.dataService.chargingStations.remove(chargingStation);

    return chargingStation;
  }

  private async saveChargingStationAndCompany({
    chargingStation,
    company,
  }: SaveChargingStationInterface): Promise<ChargingStation> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataService.chargingStations.save(chargingStation);
      await this.dataService.companies.save(company);

      return chargingStation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
