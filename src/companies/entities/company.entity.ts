import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ChargingStations } from './charging-stations.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  parent_company_id: number;

  @JoinTable()
  @ManyToMany(
    (type) => ChargingStations,
    (charging_station) => charging_station.companies,
  )
  charging_stations: ChargingStations[];
}
