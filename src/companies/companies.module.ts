import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { ChargingStations } from './entities/charging-stations.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, ChargingStations])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
