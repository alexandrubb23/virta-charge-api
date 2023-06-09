import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, FindOneOptions, Repository } from 'typeorm';

import { ChargingStation } from './entities/charging-station.entity';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { Company } from 'src/companies/entities/company.entity';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { SaveChargingStationInterface } from './models/charging-station.interface';

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

  async findNearbyChargingStations(
    latitude: number,
    longitude: number,
    radius: number,
    company_id?: number,
  ): Promise<ChargingStation[]> {
    const chargingStations = await this.chargingStationsRepository
      .createQueryBuilder('charging_stations')
      .select('charging_stations.*')
      .addSelect(
        `ST_Distance(
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326),
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        ) as distance`,
      )
      .where(
        `ST_DWithin(
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
          :radius -- Radius in meters (1 kilometer = 1000 meters)
        )`,
        { longitude, latitude, radius },
      )
      // .where('charging_stations.company_id = :company_id', { company_id })
      //     .andWhere(
      //       `
      //   ST_DWithin(
      //     ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
      //     ST_SetSRID(ST_MakePoint(
      //       CAST(SPLIT_PART(charging_stations.address, ',', 1) AS DOUBLE PRECISION),
      //       CAST(SPLIT_PART(charging_stations.address, ',', 2) AS DOUBLE PRECISION)
      //     ), 4326),
      //     :radius
      //   )
      // `,
      //       { radius, longitude, latitude },
      //     )
      .orderBy('distance', 'ASC')
      .getRawMany();

    return chargingStations;
  }

  async create(
    createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    const company = await this.findCompany(createChargingStationDto.company_id);
    const chargingStation = this.chargingStationsRepository.create(
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
