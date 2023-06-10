import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChargingStationsModule } from './charging-stations/charging-stations.module';
import { CompaniesModule } from './companies/companies.module';
import { databaseSchema } from './validation';
import { CommonModule } from './common/common.module';
import isProduction from './utils/environment';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: isProduction,
      validationSchema: databaseSchema,
    }),
    CompaniesModule,
    ChargingStationsModule,
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DB,
        autoLoadEntities: !isProduction,
        synchronize: !isProduction,
      }),
    }),
    CommonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
