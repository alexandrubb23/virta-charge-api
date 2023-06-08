import { Module } from '@nestjs/common';
import { ChargingStationsController } from './charging-stations.controller';
import { ChargingStationsService } from './charging-stations.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChargingStation } from './entities/charging-station.entity';
import { Company } from 'src/companies/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChargingStation, Company])],
  controllers: [ChargingStationsController],
  providers: [ChargingStationsService],
})
export class ChargingStationsModule {}
