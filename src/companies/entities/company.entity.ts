import { ApiHideProperty } from '@nestjs/swagger';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { COMPANIES_CHARGING_STATIONS_TABLE } from 'src/constants/db-tables.constants';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Index()
  @Column()
  parentId: number;

  @ApiHideProperty()
  @JoinTable({
    name: COMPANIES_CHARGING_STATIONS_TABLE,
  })
  @ManyToMany(
    () => ChargingStation,
    (chargingStation) => chargingStation.company,
    {
      cascade: true,
    },
  )
  charging_stations: ChargingStation[];
}
