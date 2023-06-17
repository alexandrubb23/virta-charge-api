import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { Company } from '../entities/company.entity';
import { CompaniesWithChargingStations } from './companies-with-charging-stations.service';

const companies: Company[] = [
  {
    id: 1,
    name: 'EnergyCharge Solutions',
    parentId: 0,
    charging_stations: [
      {
        id: 1,
        name: 'PowerHub Charging Station',
        latitude: 30.27666,
        longitude: -98.40328,
        company_id: 1,
        address: '108 US-290, Johnson City, TX 78636, United States of America',
      } as ChargingStation,
    ],
  },
  {
    id: 2,
    name: 'EcoPower Innovations',
    parentId: 1,
    charging_stations: [
      {
        id: 2,
        name: 'ElecCharge Depot',
        latitude: 30.27666,
        longitude: -98.41328,
        company_id: 2,
        address: '108 US-290, Johnson City, TX 78636, United States of America',
      } as ChargingStation,
    ],
  },
  {
    id: 3,
    name: 'ElectraTech Enterprises',
    parentId: 2,
    charging_stations: [
      {
        id: 3,
        name: 'EnerCharge Plaza',
        latitude: 30.27666,
        longitude: -98.38328,
        company_id: 3,
        address:
          'Johnson City Independent School District, Texas, United States of America',
      } as ChargingStation,
    ],
  },
];

describe('companiesWithChargingStations /', () => {
  let result: Company[];
  beforeEach(() => {
    result =
      CompaniesWithChargingStations.getInstance().traverseCompanies(companies);
  });

  describe('if the company with id 2 is child of company id 1', () => {
    it('should return the company with id 1 with the charging stations of company with id 2', () => {
      const chargingStations = result[0].charging_stations;

      expect(chargingStations.length).toBe(3);
      expect(chargingStations[0].id).toBe(1);
      expect(chargingStations[1].id).toBe(2);
    });
  });

  describe('if the company with id 3 is child of company id 2', () => {
    it('should return the company with id 2 with the charging stations of company with id 3', () => {
      const chargingStations = result[1].charging_stations;

      expect(chargingStations.length).toBe(2);
      expect(chargingStations[0].id).toBe(2);
      expect(chargingStations[1].id).toBe(3);
    });
  });

  describe('if the company with id 2  is child of company id 1 and company with id 3 is child of company id 2', () => {
    it('should return the company with id 1 with the charging stations of company with id 2 and company with id 3', () => {
      const chargingStations = result[0].charging_stations;

      expect(chargingStations.length).toBe(3);
      expect(chargingStations[0].id).toBe(1);
      expect(chargingStations[1].id).toBe(2);
      expect(chargingStations[2].id).toBe(3);
    });
  });
});
