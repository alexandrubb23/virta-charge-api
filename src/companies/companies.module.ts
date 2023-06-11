import { Module } from '@nestjs/common';

import { DataServiceModule } from 'src/common/repository/data-service.module';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [DataServiceModule],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
