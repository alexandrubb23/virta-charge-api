import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, FindOneOptions } from 'typeorm';

import { ChargingStation } from './entities/charging-station.entity';
import { Company } from 'src/companies/entities/company.entity';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { DataService } from 'src/common/repository/data-service';
import { SaveChargingStationInterface } from './models/charging-station.interface';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { SearchCharginStationsQueryDto } from 'src/common/dto/search-charging-stations-query.dto';

@Injectable()
export class ChargingStationsService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly dataService: DataService,
  ) {}

  findAll(): Promise<ChargingStation[]> {
    return this.dataService.chargingStations.findAll();
  }

  async findOne(id: number): Promise<ChargingStation> {
    const options: FindOneOptions<ChargingStation> = {
      where: { id },
    };

    const chargingStation = await this.dataService.chargingStations.findOne(
      options,
    );

    if (!chargingStation) {
      throw new NotFoundException(`Charging Station #${id} not found`);
    }

    return chargingStation;
  }

  async findNearbyChargingStations(
    searchChargingStationsQuery: SearchCharginStationsQueryDto,
  ): Promise<ChargingStation[]> {
    return this.dataService.chargingStations.findNearbyChargingStations({
      ...searchChargingStationsQuery,
    });
  }

  async create(
    createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    const company = await this.findCompany(createChargingStationDto.company_id);
    const chargingStation = await this.dataService.chargingStations.create(
      createChargingStationDto,
    );

    company.charging_stations.push(chargingStation);

    await this.saveChargingStationAndCompany({ chargingStation, company });

    return chargingStation;
  }

  async update(id: number, updateChargingStationDto: UpdateChargingStationDto) {
    const { company_id } = updateChargingStationDto;

    await this.findCompany(company_id);

    const options: FindOneOptions<ChargingStation> = {
      where: { id },
    };

    const chargingStation = await this.dataService.chargingStations.findOne(
      options,
    );

    if (!chargingStation) {
      throw new BadRequestException(`Charging Station #${id} not found`);
    }

    const updatedChargingStation = await this.dataService.chargingStations.save(
      {
        ...chargingStation,
        ...updateChargingStationDto,
      },
    );

    this.updateCompaniesChargingStationsTable(company_id, chargingStation.id);

    return updatedChargingStation;
  }

  async remove(id: number): Promise<ChargingStation> {
    const options: FindOneOptions<ChargingStation> = {
      where: { id },
      relations: ['company'],
    };

    const chargingStation = await this.dataService.chargingStations.findOne(
      options,
    );

    if (!chargingStation) {
      throw new BadRequestException(`Charging Station #${id} not found`);
    }

    chargingStation.company = null;

    return this.dataService.chargingStations.remove(chargingStation);
  }

  private async findCompany(id: number): Promise<Company> {
    const options: FindOneOptions<Company> = {
      where: { id },
      relations: ['charging_stations'],
    };

    const company = await this.dataService.companies.findOne(options);
    if (!company) {
      throw new BadRequestException(`Company #${id} not found`);
    }

    return company;
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

  private updateCompaniesChargingStationsTable(
    companiesId: number,
    chargingStationId: number,
  ) {
    if (!companiesId) {
      return;
    }

    this.dataSource
      .createQueryBuilder()
      .update('companies_charging_stations_charging_station')
      .set({ companiesId })
      .where('chargingStationId = :chargingStationId', {
        chargingStationId,
      })
      .execute();
  }
}
