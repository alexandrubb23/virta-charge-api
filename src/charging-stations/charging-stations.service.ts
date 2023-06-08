import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { ChargingStation } from './entities/charging-station.entity';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { Company } from 'src/companies/entities/company.entity';

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
    const options = {
      where: { id },
    };

    const charginStation = await this.chargingStationsRepository.findOne(
      options,
    );

    if (!charginStation) {
      throw new NotFoundException(`Charging Station #${id} not found`);
    }

    return charginStation;
  }

  async create(
    createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    const options = {
      where: { id: createChargingStationDto.company_id },
      relations: {
        charging_stations: true,
      },
    };

    const company = await this.companiesRepository.findOne(options);

    if (!company) {
      throw new BadRequestException('Company with the given id not found');
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
    } finally {
      await queryRunner.release();
    }
  }
}
