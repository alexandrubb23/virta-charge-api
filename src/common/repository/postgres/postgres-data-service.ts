import { OnApplicationBootstrap } from '@nestjs/common';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { Company } from 'src/companies/entities/company.entity';
import { Repository } from 'typeorm';
import { DataService } from '../data-service';
import { PostgresGenericRepository } from './postgres-generic-repository';
import { InjectRepository } from '@nestjs/typeorm';

export class PostgresDataService
  implements DataService, OnApplicationBootstrap
{
  companies: PostgresGenericRepository<Company>;
  chargingStations: PostgresGenericRepository<ChargingStation>;

  constructor(
    @InjectRepository(Company)
    private readonly companiesRepository: Repository<Company>,
    @InjectRepository(ChargingStation)
    private readonly chargingStationsRepository: Repository<ChargingStation>,
  ) {}

  onApplicationBootstrap() {
    this.companies = new PostgresGenericRepository<Company>(
      this.companiesRepository,
    );

    this.chargingStations = new PostgresGenericRepository<ChargingStation>(
      this.chargingStationsRepository,
    );
  }
}
