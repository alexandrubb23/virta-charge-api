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
import { COMPANIES_CHARGING_STATIONS_TABLE } from 'src/constants/db-tables.constants';

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
    const chargingStation = await this.dataService.chargingStations.create(
      createChargingStationDto,
    );

    return this.dataService.chargingStations.save(chargingStation);
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

    // TODO: There must be a better way to do this
    // await this.dataSource
    //   .createQueryBuilder()
    //   .update(COMPANIES_CHARGING_STATIONS_TABLE)
    //   .set({ companiesId: company_id })
    //   .where('chargingStationId = :chargingStationId', {
    //     chargingStationId: chargingStation.id,
    //   })
    //   .execute();

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

    await this.dataService.chargingStations.remove(chargingStation);

    return chargingStation;
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
}
