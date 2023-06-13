import { ApiHideProperty } from '@nestjs/swagger';
import { Company } from 'src/companies/entities/company.entity';
import { COMPANIES_CHARGING_STATIONS_TABLE } from 'src/constants/db-tables.constants';
import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ChargingStation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
  })
  latitude: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 6,
  })
  longitude: number;

  @Index()
  @Column()
  company_id: number;

  @Column()
  address: string;

  @ApiHideProperty()
  @JoinTable({
    name: COMPANIES_CHARGING_STATIONS_TABLE,
  })
  @ManyToMany(() => Company, (company) => company.charging_stations, {
    cascade: true,
  })
  company: Company[];
}
