import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository } from 'typeorm';

import { ChargingStation } from './entities/charging-station.entity';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { Company } from 'src/companies/entities/company.entity';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';

@Injectable()
export class ChargingStationsService {
  constructor(
    @InjectRepository(ChargingStation)
    private readonly chargingStationsRepository: Repository<ChargingStation>,
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    private readonly dataSource: DataSource,
  ) {}

  findAll(): Promise<ChargingStation[]> {
    return this.chargingStationsRepository.find();
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

  async create(
    createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    const { company_id } = createChargingStationDto;
    const company = await this.findCompany(company_id);

    if (!company) {
      throw new BadRequestException(
        `Charging Station #${company_id} not found`,
      );
    }

    const chargingStation = this.chargingStationsRepository.create(
      createChargingStationDto,
    );

    company.charging_stations.push(chargingStation);

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

  async update(id: number, updateChargingStationDto: UpdateChargingStationDto) {
    if (Object.keys(updateChargingStationDto).length === 0) {
      throw new BadRequestException('No fields to update were provided');
    }

    const company = await this.findCompany(updateChargingStationDto.company_id);
    if (!company) {
      throw new BadRequestException(`Company #${id} not found`);
    }

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

  private findCompany(id: number): Promise<Company> {
    const options = {
      where: { id },
      relations: ['charging_stations'],
    };

    return this.companiesRepository.findOne(options);
  }
}
