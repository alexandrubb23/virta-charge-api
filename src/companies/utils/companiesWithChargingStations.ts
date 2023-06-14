import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { Company } from '../entities/company.entity';

// By utilizing memoization, we avoid redundant calculations for companies
// that have already been processed, resulting in significant performance
// improvements. The time complexity is reduced to O(n) in the average case,
// assuming a balanced company hierarchy. However, in the worst case scenario
// where the company hierarchy is a straight line from root to leaf, the time
// complexity will be O(n^2) due to the nature of the input.
export const companiesWithChargingStations = (companies: Company[]): any => {
  const companyMap = {};

  // Build parent-child relationship map
  companies.forEach((company) => {
    if (company.id === company.parentId) {
      company.parentId = 0;
    }

    const { parentId } = company;
    if (parentId !== 0) {
      if (!companyMap[parentId]) {
        companyMap[parentId] = [];
      }
      companyMap[parentId].push(company);
    }
  });

  // Memoization map to store computed charging stations
  const memo = new Map();

  // Recursive function with memoization to collect charging stations
  const collectChargingStations = (
    company: Company,
    visited = new Set<number>(),
  ): Set<ChargingStation> => {
    const companiId = company.id;

    if (visited.has(companiId)) {
      // Company has already been visited, return empty set to break the cycle
      return new Set();
    }

    visited.add(companiId);

    if (memo.has(companiId)) {
      return memo.get(companiId);
    }

    const chargingStations = new Set(company.charging_stations);

    const children = companyMap[companiId];
    if (children) {
      children.forEach((child: Company) => {
        const childChargingStations = collectChargingStations(child, visited);
        childChargingStations.forEach((station) =>
          chargingStations.add(station),
        );
      });
    }

    memo.set(companiId, chargingStations);
    return chargingStations;
  };

  // Update charging stations for each company
  companies.forEach((company) => {
    const chargingStations = collectChargingStations(company);
    if (chargingStations.size > 0) {
      company.charging_stations = Array.from(chargingStations);
    }
  });

  return companies;
};
