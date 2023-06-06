import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CompaniesController } from './controllers/companies/companies.controller';

@Module({
  imports: [],
  controllers: [AppController, CompaniesController],
  providers: [AppService],
})
export class AppModule {}
