import { Body, Controller, Get, Param, Post } from '@nestjs/common';

@Controller('companies')
export class CompaniesController {
  @Get()
  findAll(): string {
    return 'This action returns all companies';
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} company`;
  }

  @Post()
  create(@Body() body) {
    return body;
  }
}
