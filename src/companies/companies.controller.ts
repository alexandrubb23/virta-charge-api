import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(@Query() paginationQuery): Company[] {
    // const { limit, offset } = paginationQuery;
    return this.companiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Company {
    const company = this.companiesService.findOne(id);
    // TODO: Use interceptors (filters)
    if (!company) throw new NotFoundException(`Company #${id} not found`);

    return company;
  }

  @Post()
  create(@Body() body) {
    return this.companiesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return this.companiesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.companiesService.remove(id);
  }
}
