import { Module } from '@nestjs/common';
import { ChargingStationsController } from './charging-stations.controller';
import { CompaniesService } from 'src/companies/companies.service';
import { ChargingStationsService } from './charging-stations.service';
import { DataServiceModule } from 'src/common/repository/data-service.module';

@Module({
  imports: [DataServiceModule],
  controllers: [ChargingStationsController],
  providers: [ChargingStationsService, CompaniesService],
})
export class ChargingStationsModule {}
