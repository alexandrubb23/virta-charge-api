import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChargingStation } from './charging-station.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  parentId: number;

  @JoinTable()
  @ManyToMany(
    () => ChargingStation,
    (chargingStation) => chargingStation.company,
    {
      cascade: true,
    },
  )
  charging_stations: ChargingStation[];
}
