import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ChargingStationsService } from './charging-stations.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { ChargingStation } from './entities/charging-station.entity';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';

@Controller('charging-stations')
export class ChargingStationsController {
  constructor(
    private readonly chargingStationService: ChargingStationsService,
  ) {}
  @Get()
  findAll(): Promise<ChargingStation[]> {
    return this.chargingStationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<ChargingStation> {
    return this.chargingStationService.findOne(id);
  }

  @Post()
  create(
    @Body() createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    return this.chargingStationService.create(createChargingStationDto);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateChargingStationDto: UpdateChargingStationDto,
  ): Promise<ChargingStation> {
    return this.chargingStationService.update(id, updateChargingStationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<ChargingStation> {
    return this.chargingStationService.remove(id);
  }
}
