import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import isProduction from 'src/utils/environment';
import { DataService } from '../data-service';
import { PostgresDataService } from './postgres-data-service';
import { Company } from 'src/companies/entities/company.entity';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';

@Module({
  imports: [
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
