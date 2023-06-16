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
  UseInterceptors,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  ApiAuthAndPayload,
  ApiAuthWithNotFound,
} from 'src/common/decorators/api.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { StripPropertyOnResponse } from 'src/common/decorators/strip-property.decorator';
import { SearchCharginStationsQueryDto } from 'src/common/dto/search-charging-stations-query.dto';
import { FieldsToUpdateValidatorPipe } from 'src/common/pipes/fields-to-update-validator.pipe';
import { ChargingStationsService } from './charging-stations.service';
import { CreateChargingStationDto } from './dto/create-charging-station.dto';
import { UpdateChargingStationDto } from './dto/update-charging-station.dto';
import { ChargingStation } from './entities/charging-station.entity';
import CacheChargingStationsInterceptor from 'src/companies/interceptors/cache-charging-stations.interceptor';

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

  @UseInterceptors(CacheChargingStationsInterceptor)
  @ApiAuthAndPayload()
  @Post()
  create(
    @Body() createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    return this.chargingStationService.create(createChargingStationDto);
  }

  @UseInterceptors(CacheChargingStationsInterceptor)
  @ApiAuthAndPayload()
  @Patch(':id')
  @StripPropertyOnResponse('company')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(FieldsToUpdateValidatorPipe)
    updateChargingStationDto: UpdateChargingStationDto,
  ): Promise<ChargingStation> {
    return this.chargingStationService.update(id, updateChargingStationDto);
  }

  @UseInterceptors(CacheChargingStationsInterceptor)
  @ApiAuthWithNotFound()
  @Delete(':id')
  @StripPropertyOnResponse('company')
  remove(@Param('id', ParseIntPipe) id: number): Promise<ChargingStation> {
    return this.chargingStationService.remove(id);
  }
}
