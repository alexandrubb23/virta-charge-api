import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity()
export class ChargingStations {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  company_id: number;

  @Column()
  address: string;

  @ManyToMany((type) => Company, (company) => company.charging_stations)
  companies: Company[];
}
