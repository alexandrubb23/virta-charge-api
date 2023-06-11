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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FieldsToUpdateValidatorPipe } from 'src/common/pipes/fields-to-update-validator.pipe';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import {
  CompaniesChargingStationsInterceptor,
  CompanyChargingStationsInterceptor,
} from './interceptors';
import {
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
} from 'src/constants/http-response.constants';
import {
  ApiAuthAndPayload,
  ApiAuthWithNotFound,
  PaginateQuery,
} from 'src/common/decorators/api.decorator';

@ApiTags('Companies API')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseInterceptors(CompaniesChargingStationsInterceptor)
  @Public()
  @Get()
  @PaginateQuery()
  findAll(@Query() paginationQuery?: PaginationQueryDto): Promise<Company[]> {
    return this.companiesService.findAll(paginationQuery);
  }

  @UseInterceptors(CompanyChargingStationsInterceptor)
  @Public()
  @Get(':id')
  @ApiNotFoundResponse({ ...NOT_FOUND })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return this.companiesService.findOne(id);
  }

  @ApiAuthAndPayload()
  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @ApiAuthAndPayload()
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(FieldsToUpdateValidatorPipe) updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @ApiAuthWithNotFound()
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.remove(id);
  }
}
