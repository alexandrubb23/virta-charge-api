import { Controller, Get } from '@nestjs/common';
import { ChargingStationsService } from './charging-stations.service';

@Controller('charging-stations')
export class ChargingStationsController {
  constructor(
    private readonly chargingStationService: ChargingStationsService,
  ) {}
  @Get()
  findAll() {
    return this.chargingStationService.findAll();
  }
}
