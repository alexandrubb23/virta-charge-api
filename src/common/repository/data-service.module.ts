import { Module } from '@nestjs/common';
import { PostgresDataServiceModule } from './postgres/postgres-data-service.module';

@Module({
  imports: [PostgresDataServiceModule],
  exports: [PostgresDataServiceModule],
})
export class DataServiceModule {}
