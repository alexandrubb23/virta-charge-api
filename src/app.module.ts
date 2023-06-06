import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesController } from './companies/companies.controller';
import { CompaniesService } from './companies/companies.service';

@Module({
  imports: [],
  controllers: [AppController, CompaniesController],
  providers: [AppService, CompaniesService],
})
export class AppModule {}
