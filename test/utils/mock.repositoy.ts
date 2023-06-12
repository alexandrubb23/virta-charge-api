import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import { DataService } from 'src/common/repository/data-service';
import { GenericRepository } from 'src/common/repository/generic-repository';
import { Company } from 'src/companies/entities/company.entity';

export type SpyOn<T> = {
  methodName: keyof GenericRepository<T>;
  value: T | T[];
};

export const createMockGenericRepository = <T = any>(): GenericRepository<T> =>
  ({
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    findNearbyChargingStations: jest.fn(),
  } as unknown as GenericRepository<T>);

export const createMockRepository = (): DataService => ({
  companies: createMockGenericRepository<Company>(),
  chargingStations: createMockGenericRepository<ChargingStation>(),
});

export const spyOnChargingStationsService =
  (dataService: DataService) =>
  ({ methodName, value }: SpyOn<ChargingStation>) => {
    jest
      .spyOn(dataService.chargingStations, methodName)
      .mockResolvedValue(value);
  };

export const spyOnCompaniesService =
  (dataService: DataService) =>
  ({ methodName, value }: SpyOn<Company>) => {
    jest.spyOn(dataService.companies, methodName).mockResolvedValue(value);
  };
