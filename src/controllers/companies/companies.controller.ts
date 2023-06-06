import { Controller, Get } from '@nestjs/common';

@Controller('companies')
export class CompaniesController {
  @Get()
  findAll(): string {
    return 'This action returns all companies';
  }
}
