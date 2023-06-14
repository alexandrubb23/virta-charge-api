import { Module } from '@nestjs/common';
import { DataServiceModule } from 'src/common/repository/data-service.module';
import { ChargingStationsController } from './charging-stations.controller';
import { ChargingStationsService } from './charging-stations.service';
import { CompaniesService } from 'src/companies/companies.service';

@Module({
  imports: [DataServiceModule],
  controllers: [ChargingStationsController],
  providers: [ChargingStationsService, CompaniesService],
})
export class ChargingStationsModule {}
