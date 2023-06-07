import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { ChargingStation } from './entities/charging-station.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Company, ChargingStation])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
