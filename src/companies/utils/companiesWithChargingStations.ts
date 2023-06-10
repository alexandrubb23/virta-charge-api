import { Company } from '../entities/company.entity';

export const companiesWithChargingStations = (
  companies: Company[],
): Company[] => {
  const procesed = new Map();
  const companiesWithChargingStations = new Map();

  companies.forEach((company) => {
    companiesWithChargingStations.set(company.id, company);
  });

  const childrenChargingStations = (company: Company, parents = new Set()) => {
    if (procesed.get(company.id)) return;

    // The time complexity of this function is O(n) where n is the number of companies
    const children = companies.filter(
      (c) => c.parentId === company.id && c.id !== c.parentId,
    );

    if (children.length === 0) return;

    // The time complexity of this function is O(1) on average
    parents.add(company.id);

    // The time complexity of this operation is O(1)
    // since it's accessing an array element by index
    const nextChild = children[0];
    if (!nextChild) return;

    // The time complexity of this operation is O(k),
    // where k is the total number of charging stations across all children
    const mappedChildren = children.flatMap((c) => c.charging_stations);

    // The time complexity of this loop is O(p),
    // where p is the number of parents in the set
    parents.forEach((parent) => {
      procesed.set(company.id, true);

      const getCompany = companiesWithChargingStations.get(parent);

      companiesWithChargingStations.set(parent, {
        ...getCompany,
        charging_stations: [...getCompany.charging_stations, ...mappedChildren],
      });
    });

    return childrenChargingStations(nextChild, parents);
  };

  companies.forEach((company) => childrenChargingStations(company));

  return Array.from(companiesWithChargingStations.values());
};
