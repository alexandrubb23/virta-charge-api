import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChargingStationsModule } from './charging-stations/charging-stations.module';
import { CompaniesModule } from './companies/companies.module';
import { databaseSchema } from './validation';
import { databaseConfig } from './config';
import isProduction from './utils/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: isProduction,
      validationSchema: databaseSchema,
    }),
    CompaniesModule,
    ChargingStationsModule,
    TypeOrmModule.forRoot(databaseConfig()),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
