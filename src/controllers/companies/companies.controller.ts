import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

@Controller('companies')
export class CompaniesController {
  @Get()
  findAll(@Query() paginationQuery): string {
    const { limit, offset } = paginationQuery;
    return `This action returns all companies. Limit: ${limit}, offset: ${offset}`;
  }

  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This action returns a #${id} company`;
  }

  @Post()
  create(@Body() body) {
    return body;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body) {
    return `This action updates a #${id} company`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} company`;
  }
}
