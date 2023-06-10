import { Company } from 'src/companies/entities/company.entity';
import { GenericRepository } from './generic-repository';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';

export abstract class DataService {
  abstract companies: GenericRepository<Company>;
  abstract chargingStations: GenericRepository<ChargingStation>;
}
