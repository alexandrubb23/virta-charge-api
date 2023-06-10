import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { GenericRepository } from '../generic-repository';
import { NearbyChargingStationsQuery } from 'src/repositories/chargin-stations-repository.abstarct';

export class PostgresGenericRepository<T> implements GenericRepository<T> {
  constructor(private readonly repository: Repository<T>) {}

  findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  findOne(options: FindOneOptions<T>): Promise<T> {
    return this.repository.findOne(options);
  }

  save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  create(entity: T): Promise<T> {
    const createdEntity = this.repository.create(entity);
    return Promise.resolve(createdEntity);
  }

  update(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  preload(entity: T): Promise<T> {
    return this.repository.preload(entity);
  }

  remove(entity: T): Promise<T> {
    return this.repository.remove(entity);
  }

  async findNearbyChargingStations({
    company_id,
    latitude,
    longitude,
    radius,
  }: NearbyChargingStationsQuery): Promise<T[]> {
    const queryBuilder = this.repository
      .createQueryBuilder('charging_stations')
      .select('charging_stations.*')
      .addSelect(
        `ST_Distance(
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326),
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
        ) as distance`,
      )
      .where(
        `ST_DWithin(
          ST_SetSRID(ST_MakePoint(:longitude, :latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography,
            :radius -- Radius in meters (1 kilometer = 1000 meters)
        )`,
        { longitude, latitude, radius },
      )
      .groupBy(
        'charging_stations.id, charging_stations.latitude, charging_stations.longitude',
      )
      .orderBy('distance', 'ASC');

    if (company_id) {
      queryBuilder.andWhere('charging_stations.company_id = :company_id', {
        company_id,
      });
    }

    const chargingStations = await queryBuilder.getRawMany();

    return chargingStations;
  }
}
