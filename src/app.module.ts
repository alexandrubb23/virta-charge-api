import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { ChargingStationsModule } from './charging-stations/charging-stations.module';
import { CommonModule } from './common/common.module';
import { DataServiceModule } from './common/repository/data-service.module';
import { CompaniesModule } from './companies/companies.module';
import { isProduction, isTest } from './utils/environment.helper';
import { databaseSchema } from './validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: isTest ? '.env.test' : '.env',
      ignoreEnvFile: isProduction,
      validationSchema: databaseSchema,
    }),
    CompaniesModule,
    ChargingStationsModule,
    CommonModule,
    DataServiceModule,
  ],
  providers: [AppService],
})
export class AppModule {}
