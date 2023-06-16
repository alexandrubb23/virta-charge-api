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
import { ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  ApiAuthAndPayload,
  ApiAuthWithNotFound,
  ClearCompaniesCacheOnAfter,
  Public,
  StripPropertyOnResponse,
} from 'src/common/decorators';
import { SearchCharginStationsQueryDto } from 'src/common/dto/search-charging-stations-query.dto';
import { FieldsToUpdateValidatorPipe } from 'src/common/pipes/fields-to-update-validator.pipe';
import { ChargingStationsService } from './charging-stations.service';
import { CreateChargingStationDto, UpdateChargingStationDto } from './dto';
import { ChargingStation } from './entities/charging-station.entity';

@ApiTags('Charging Stations API')
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

  @ApiQuery({ name: 'company_id', required: false })
  @Public()
  @Get('search')
  findNearbyChargingStations(
    @Query() searchChargingStationsQuery: SearchCharginStationsQueryDto,
  ): Promise<ChargingStation[]> {
    return this.chargingStationService.findNearbyChargingStations({
      ...searchChargingStationsQuery,
    });
  }

  @Public()
  @Get(':id')
  @StripPropertyOnResponse('company')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ChargingStation> {
    return this.chargingStationService.findOne(id);
  }

  @ApiAuthAndPayload()
  @ClearCompaniesCacheOnAfter()
  @Post()
  create(
    @Body() createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    return this.chargingStationService.create(createChargingStationDto);
  }

  @ApiAuthAndPayload()
  @ClearCompaniesCacheOnAfter()
  @StripPropertyOnResponse('company')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(FieldsToUpdateValidatorPipe)
    updateChargingStationDto: UpdateChargingStationDto,
  ): Promise<ChargingStation> {
    return this.chargingStationService.update(id, updateChargingStationDto);
  }

  @ApiAuthWithNotFound()
  @ClearCompaniesCacheOnAfter()
  @StripPropertyOnResponse('company')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ChargingStation> {
    return this.chargingStationService.remove(id);
  }
}
