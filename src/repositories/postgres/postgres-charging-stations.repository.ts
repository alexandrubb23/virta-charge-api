import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';

import { CreateChargingStationDto } from 'src/charging-stations/dto/create-charging-station.dto';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';
import {
  CharginStationsRepository,
  ChargingStationDto,
  NearbyChargingStationsQuery,
} from '../chargin-stations-repository.abstarct';

export class PostgresChargingStationRepository
  implements CharginStationsRepository
{
  constructor(
    @InjectRepository(ChargingStation)
    private readonly chargingStationsRepository: Repository<ChargingStation>,
  ) {}

  findAll(): Promise<ChargingStation[]> {
    return this.chargingStationsRepository.find();
  }

  findOne(options: FindOneOptions<ChargingStation>): Promise<ChargingStation> {
    return this.chargingStationsRepository.findOne(options);
  }

  async findNearbyChargingStations({
    company_id,
    latitude,
    longitude,
    radius,
  }: NearbyChargingStationsQuery): Promise<ChargingStation[]> {
    const queryBuilder = this.chargingStationsRepository
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

  async create(
    createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation> {
    return this.chargingStationsRepository.create(createChargingStationDto);
  }

  async save(chargingStationDto: ChargingStationDto) {
    return this.chargingStationsRepository.save(chargingStationDto);
  }

  async remove(chargingStation: ChargingStation): Promise<ChargingStation> {
    return this.chargingStationsRepository.remove(chargingStation);
  }
}
