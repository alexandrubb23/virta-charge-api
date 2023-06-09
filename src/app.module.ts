import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChargingStationsModule } from './charging-stations/charging-stations.module';
import { CompaniesModule } from './companies/companies.module';
import { databaseSchema } from './validation';

const isProduction = process.env.NODE_ENV === 'production';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: isProduction,
      validationSchema: databaseSchema,
    }),
    CompaniesModule,
    ChargingStationsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      autoLoadEntities: !isProduction,
      synchronize: !isProduction,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
