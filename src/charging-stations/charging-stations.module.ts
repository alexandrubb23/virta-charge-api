import { Module } from '@nestjs/common';
import { DataServiceModule } from 'src/common/repository/data-service.module';
import { ChargingStationsController } from './charging-stations.controller';
import { ChargingStationsService } from './charging-stations.service';

@Module({
  imports: [DataServiceModule],
  controllers: [ChargingStationsController],
  providers: [ChargingStationsService],
})
export class ChargingStationsModule {}
