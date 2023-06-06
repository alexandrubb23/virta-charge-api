import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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
    () => ChargingStations,
    (chargingStation) => chargingStation.companies,
    {
      cascade: true,
    },
  )
  charging_stations: ChargingStations[];
}
