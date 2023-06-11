import { FindManyOptions, FindOneOptions } from 'typeorm';

export type NearbyChargingStationsQuery = {
  company_id?: number;
  latitude: number;
  longitude: number;
  radius: number;
};

export abstract class GenericRepository<T> {
  abstract findAll(options?: FindManyOptions<T>): Promise<T[]>;
  abstract findOne(options: FindOneOptions<T>): Promise<T>;
  abstract save(entity: T): Promise<T>;
  abstract create(entity: Partial<T>): Promise<T>;
  abstract update(entity: T): Promise<T>;
  abstract preload(entity: Partial<T>): Promise<T>;
  abstract remove(entity: T): Promise<T>;
  abstract findNearbyChargingStations({
    company_id,
    latitude,
    longitude,
    radius,
  }: NearbyChargingStationsQuery): Promise<T[]>;
}
