import { ApiHideProperty } from '@nestjs/swagger';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import {
  Column,
  Entity,
  Index,
  OneToMany,
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
  @OneToMany(
    () => ChargingStation,
    (chargingStation) => chargingStation.company,
    {
      cascade: true,
    },
  )
  charging_stations: ChargingStation[];
}
