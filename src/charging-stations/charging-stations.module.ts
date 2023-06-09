import { Module } from '@nestjs/common';
import { ChargingStationsController } from './charging-stations.controller';
import { ChargingStationsService } from './charging-stations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingStation } from './entities/charging-station.entity';
import { Company } from 'src/companies/entities/company.entity';
import { CharginStationsRepository } from 'src/repositories/chargin-stations-repository.abstarct';
import { PostgresChargingStationRepository } from 'src/repositories/postgres/postgres-charging-stations.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChargingStation,
      Company,
      CharginStationsRepository,
    ]),
  ],
  controllers: [ChargingStationsController],
  providers: [
    ChargingStationsService,
    {
      provide: CharginStationsRepository,
      useClass: PostgresChargingStationRepository,
    },
  ],
})
export class ChargingStationsModule {}
