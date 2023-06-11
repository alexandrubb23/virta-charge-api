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
import { Public } from 'src/common/decorators/public.decorator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Company } from './entities/company.entity';
import {
  CompanyChargingStationsInterceptor,
  CompaniesChargingStationsInterceptor,
} from './interceptors';
import { FieldsToUpdateValidatorPipe } from 'src/common/pipes/fields-to-update-validator.pipe';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @UseInterceptors(CompaniesChargingStationsInterceptor)
  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto): Promise<Company[]> {
    return this.companiesService.findAll(paginationQuery);
  }

  @UseInterceptors(CompanyChargingStationsInterceptor)
  @Public()
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Company> {
    return this.companiesService.findOne(id);
  }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(FieldsToUpdateValidatorPipe) updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.remove(id);
  }
}
