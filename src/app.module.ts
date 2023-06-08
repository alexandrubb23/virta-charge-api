import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChargingStationsModule } from './charging-stations/charging-stations.module';
import { CompaniesModule } from './companies/companies.module';

@Module({
  imports: [
    CompaniesModule,
    ChargingStationsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true, // TODO: Disable this in production
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
