import { FindManyOptions, FindOneOptions } from 'typeorm';
import { SearchCharginStationsQueryDto } from '../dto/search-charging-stations-query.dto';

export abstract class GenericRepository<T> {
  abstract findAll(options?: FindManyOptions<T>): Promise<T[]>;
  abstract findOne(options: FindOneOptions<T>): Promise<T>;
  abstract save(entity: T): Promise<T>;
  abstract create(entity: Partial<T>): Promise<T>;
  abstract update(entity: T): Promise<T>;
  abstract preload(entity: Partial<T>): Promise<T>;
  abstract remove(entity: T): Promise<T>;
  abstract findNearbyChargingStations(
    searchChargingStationsQuery: SearchCharginStationsQueryDto,
  ): Promise<T[]>;
}
