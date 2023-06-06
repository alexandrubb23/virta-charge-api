export class Company {
  id: number;
  name: string;
  parent_company_id: number;
  children: Company[];
  charging_stations: string[];
}
