import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { Company } from '../entities/company.entity';

export class CompaniesWithChargingStations {
  /**
   * Companies map.
   *
   * @private
   */
  private static COMPANIES_MAP = new Map<number, Company[]>();

  /**
   * Stations map.
   *
   * @private
   */
  private static STATIONS = new Map<number, Set<ChargingStation>>();

  /**
   * List of companies.
   *
   * @private
   */
  private companies: Company[] = new Array<Company>();

  /**
   * Companies map.
   *
   * @private
   */
  private companiesMap = CompaniesWithChargingStations.COMPANIES_MAP;

  /**
   * Stations map.
   *
   * @private
   */
  private stations = CompaniesWithChargingStations.STATIONS;

  /**
   * This is the singleton instance of the class.
   *
   * @private
   */
  private static instance: CompaniesWithChargingStations =
    new CompaniesWithChargingStations();

  /**
   * This is the private constructor of the class.
   *
   * @private
   */
  private constructor() {
    // Block the creation of the class instance.
  }

  /**
   * Create a singleton instance of the class.
   *
   * @returns
   */
  static getInstance(): CompaniesWithChargingStations {
    return CompaniesWithChargingStations.instance;
  }

  /**
   * Clear the cache.
   *
   * @returns void
   */
  clearCache = (): void => {
    const { COMPANIES_MAP, STATIONS } = CompaniesWithChargingStations;

    this.companiesMap = COMPANIES_MAP;
    this.stations = STATIONS;
  };

  /**
   * Traverse companies and update charging stations.
   *
   * @param companies Company[]
   * @returns Company[]
   */
  traverseCompanies = (companies: Company[]): Company[] => {
    this.companies = companies;

    this.buildParentChildRelationshipMap();

    return this.buildCompaniesWithChargingStations();
  };

  /**
   * Build parent-child relationship map and update charging stations
   *
   * @param company
   * @param visited
   * @returns
   */
  private updateChargingStations = (
    company: Company,
    visited: Set<number>,
  ): Set<ChargingStation> => {
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

    visited.add(companyId);

    const children = this.companiesMap.get(companyId);
    if (children) {
      children.forEach((child: Company) => {
        if (!visited.has(child.id)) {
          const childChargingStations = this.updateChargingStations(
            child,
            visited,
          );
          childChargingStations.forEach((station) =>
            chargingStations.add(station),
          );
        }
      });
    }

    console.log('memo miss');

    this.stations.set(companyId, chargingStations);

    return chargingStations;
  };

  /**
   * Build parent-child relationship map.
   *
   * @returns void
   */
  private buildParentChildRelationshipMap = (): void => {
    this.companies.forEach((company) => {
      if (company.id === company.parentId) {
        company.parentId = 0;
      }

      const { parentId } = company;
      if (parentId === 0) return;

      if (!this.companiesMap.has(parentId)) {
        this.companiesMap.set(parentId, []);
      }

      this.companiesMap.get(parentId).push(company);
    });
  };

  /**
   * Build companies with charging stations.
   *
   * @returns Company[]
   */
  private buildCompaniesWithChargingStations = (): Company[] => {
    this.companies.forEach((company) => {
      const chargingStations = this.updateChargingStations(
        company,
        new Set<number>(),
      );

      if (chargingStations.size > 0) {
        company.charging_stations = Array.from(chargingStations);
      }
    });

    return this.companies;
  };
}
