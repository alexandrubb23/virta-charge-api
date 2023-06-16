import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { Company } from '../entities/company.entity';

export class CompaniesWithChargingStations {
  private companiesMap = new Map<number, Company[]>();
  private stations = new Map<number, Set<ChargingStation>>();

  private static instance: CompaniesWithChargingStations;

  private constructor() {
    // Do nothing
  }

  static getInstance(): CompaniesWithChargingStations {
    if (!CompaniesWithChargingStations.instance) {
      CompaniesWithChargingStations.instance =
        new CompaniesWithChargingStations();
    }

    return CompaniesWithChargingStations.instance;
  }

  clearCache = () => {
    this.companiesMap = new Map<number, Company[]>();
    this.stations = new Map<number, Set<ChargingStation>>();
  };

  // Build parent-child relationship map and update charging stations
  updateChargingStations = (company: Company): Set<ChargingStation> => {
    const companyId = company.id;
    const cachedStations = this.stations.get(companyId);

    if (cachedStations) {
      console.log('memo hit');
      return cachedStations;
    }

    const chargingStations = new Set<ChargingStation>();

    company.charging_stations.forEach((station) =>
      chargingStations.add(station),
    );

    const children = this.companiesMap.get(companyId);
    if (children) {
      children.forEach((child: Company) => {
        const childChargingStations = this.updateChargingStations(child);
        childChargingStations.forEach((station) =>
          chargingStations.add(station),
        );
      });
    }

    console.log('memo miss');

    this.stations.set(companyId, chargingStations);

    return chargingStations;
  };

  companiesWithChargingStations = (companies: Company[]): Company[] => {
    // Build parent-child relationship map
    companies.forEach((company) => {
      if (company.id === company.parentId) {
        company.parentId = 0;
      }

      const { parentId } = company;
      if (parentId !== 0) {
        if (!this.companiesMap.has(parentId)) {
          this.companiesMap.set(parentId, []);
        }
        this.companiesMap.get(parentId)?.push(company);
      }
    });

    // Update charging stations for each company
    companies.forEach((company) => {
      const chargingStations = this.updateChargingStations(company);

      if (chargingStations.size > 0) {
        company.charging_stations = Array.from(chargingStations);
      }
    });

    return companies;
  };
}
