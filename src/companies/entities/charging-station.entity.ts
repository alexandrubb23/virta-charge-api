import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';

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

  @Column()
  company_id: number;

  @Column()
  address: string;

  @ManyToMany((type) => Company, (company) => company.charging_stations)
  company: Company;
}
