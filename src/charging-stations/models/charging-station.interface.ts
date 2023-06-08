import { Company } from 'src/companies/entities/company.entity';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';

export class SaveChargingStationInterface {
  chargingStation: ChargingStation;
  company: Company;
}
