import { ApiHideProperty } from '@nestjs/swagger';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
  @ManyToMany(
    () => ChargingStation,
    (chargingStation) => chargingStation.company,
  )
  charging_stations: ChargingStation[];
}
