import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { CharginStationsRepository } from 'src/repositories/chargin-stations-repository.abstarct';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { ChargingStation } from './entities/charging-station.entity';
import { DataSource, FindOneOptions, Repository } from 'typeorm';
import { SaveChargingStationInterface } from './models/charging-station.interface';
import { Company } from 'src/companies/entities/company.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ChargingStationsService {
  constructor(
    private readonly chargingStationsRepository: CharginStationsRepository,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<ChargingStation[]> {
    return this.chargingStationsRepository.findAll();
  }

  async findOne(id: number): Promise<ChargingStation> {
    const options: FindOneOptions<ChargingStation> = {
      where: { id },
    };

    const chargingStation = await this.chargingStationsRepository.findOne(
      options,
    );

    if (!chargingStation) {
      throw new NotFoundException(`Charging Station #${id} not found`);
    }

    return chargingStation;
  }

  async findNearbyChargingStations(
    latitude: number,
    longitude: number,
    radius: number,
    company_id?: number,
  ): Promise<ChargingStation[]> {
    return this.chargingStationsRepository.findNearbyChargingStations({
      latitude,
      longitude,
      radius,
      company_id,
    });
  }

  async create(
    createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    const company = await this.findCompany(createChargingStationDto.company_id);
    const chargingStation = await this.chargingStationsRepository.create(
      createChargingStationDto,
    );

    company.charging_stations.push(chargingStation);

    await this.saveChargingStationAndCompany({ chargingStation, company });

    return chargingStation;
  }

  async update(id: number, updateChargingStationDto: UpdateChargingStationDto) {
    if (Object.keys(updateChargingStationDto).length === 0) {
      throw new UnprocessableEntityException(
        'No fields to update were provided',
      );
    }

    await this.findCompany(updateChargingStationDto.company_id);

    const options: FindOneOptions<ChargingStation> = {
      where: { id },
    };

    const chargingStation = await this.chargingStationsRepository.findOne(
      options,
    );

    if (!chargingStation) {
      throw new BadRequestException(`Charging Station #${id} not found`);
    }

    const updatedChargingStation = await this.chargingStationsRepository.save({
      ...chargingStation,
      ...updateChargingStationDto,
    });

    return updatedChargingStation;
  }

  async remove(id: number): Promise<ChargingStation> {
    const options: FindOneOptions<ChargingStation> = {
      where: { id },
      relations: ['company'],
    };

    const chargingStation = await this.chargingStationsRepository.findOne(
      options,
    );

    if (!chargingStation) {
      throw new BadRequestException(`Charging Station #${id} not found`);
    }

    chargingStation.company = null;

    await this.chargingStationsRepository.remove(chargingStation);

    return chargingStation;
  }

  private async findCompany(id: number): Promise<Company> {
    const options: FindOneOptions<Company> = {
      where: { id },
      relations: ['charging_stations'],
    };

    const company = await this.companiesRepository.findOne(options);
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
      await this.chargingStationsRepository.save(chargingStation);
      await this.companiesRepository.save(company);

      return chargingStation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
