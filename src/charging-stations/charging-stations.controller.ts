import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ChargingStationsService } from './charging-stations.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { ChargingStation } from './entities/charging-station.entity';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { FieldsToUpdateValidatorPipe } from 'src/common/pipes/fields-to-update-validator.pipe';

@Controller('charging-stations')
export class ChargingStationsController {
  constructor(
    private readonly chargingStationService: ChargingStationsService,
  ) {}

  @Public()
  @Get()
  findAll(): Promise<ChargingStation[]> {
    return this.chargingStationService.findAll();
  }

  // @Public()
  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number): Promise<ChargingStation> {
  //   return this.chargingStationService.findOne(id);
  // }

  @Public()
  @Get('nearby')
  findNearbyChargingStations(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number,
    @Query('company_id') company_id?: number,
  ): Promise<ChargingStation[]> {
    return this.chargingStationService.findNearbyChargingStations(
      latitude,
      longitude,
      radius,
      company_id,
    );
  }

  @Post()
  create(
    @Body() createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    return this.chargingStationService.create(createChargingStationDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(FieldsToUpdateValidatorPipe)
    updateChargingStationDto: UpdateChargingStationDto,
  ): Promise<ChargingStation> {
    return this.chargingStationService.update(id, updateChargingStationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ChargingStation> {
    return this.chargingStationService.remove(id);
  }
}
