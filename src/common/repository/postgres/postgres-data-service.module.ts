import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { isProduction, isTest } from 'src/utils/environment.helper';
import { DataService } from '../data-service';
import { PostgresDataService } from './postgres-data-service';
import { Company } from 'src/companies/entities/company.entity';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { env } from 'src/utils';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT'),
        username: env('DATABASE_USER'),
        password: env('DATABASE_PASSWORD'),
        database: env('DATABASE_DB'),
        autoLoadEntities: !isProduction,
        synchronize: !isProduction,
        logging: !isProduction && !isTest,
      }),
    }),
    TypeOrmModule.forFeature([Company, ChargingStation]),
  ],
  providers: [
    {
      provide: DataService,
      useClass: PostgresDataService,
    },
  ],
  exports: [DataService],
})
export class PostgresDataServiceModule {}
