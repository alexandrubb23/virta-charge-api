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
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import {
  AddCompaniesChargingStations,
  AddCompanyChargingStations,
  ApiAuthAndPayload,
  ApiAuthWithNotFound,
  ClearCompaniesCacheOnAfter,
  PaginateQuery,
  Public,
} from 'src/common/decorators';
import { FieldsToUpdateValidatorPipe } from 'src/common/pipes/fields-to-update-validator.pipe';
import { NOT_FOUND } from 'src/constants/http-response.constants';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import ClearCompaniesCacheInterceptor from './interceptors/cache-charging-stations.interceptor';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@ApiTags('Companies API')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @AddCompaniesChargingStations()
  @Public()
  @Get()
  @PaginateQuery()
  findAll(@Query() paginationQuery?: PaginationQueryDto): Promise<Company[]> {
    return this.companiesService.findAll(paginationQuery);
  }

  @AddCompanyChargingStations()
  @Public()
  @Get(':id')
  @ApiNotFoundResponse({ ...NOT_FOUND })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return this.companiesService.findOne(id);
  }

  @ApiAuthAndPayload()
  @ClearCompaniesCacheOnAfter()
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @ApiAuthAndPayload()
  @UseInterceptors(ClearCompaniesCacheInterceptor)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(FieldsToUpdateValidatorPipe) updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @ApiAuthWithNotFound()
  @ClearCompaniesCacheOnAfter()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.remove(id);
  }
}
