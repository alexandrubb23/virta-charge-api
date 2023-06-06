import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './entities/company.entity';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  findAll(@Query() queryParams): Promise<Company[]> {
    // console.log({ paginationQuery: queryParams });
    // const { limit, offset } = paginationQuery;
    return this.companiesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Company> {
    const company = await this.companiesService.findOne(id);
    // TODO: Use interceptors (filters)
    if (!company) throw new NotFoundException(`Company #${id} not found`);

    return company;
  }

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto) {
    return this.companiesService.create(createCompanyDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.companiesService.remove(id);
  }
}
