import { FindOneOptions } from 'typeorm';

import { CreateChargingStationDto } from 'src/charging-stations/dto/create-charging-station.dto';
import { UpdateChargingStationDto } from 'src/charging-stations/dto/update-charging-station.dto';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';

export type NearbyChargingStationsQuery = {
  company_id?: number;
  latitude: number;
  longitude: number;
  radius: number;
};

export type ChargingStationDto =
  | UpdateChargingStationDto
  | CreateChargingStationDto;

export abstract class CharginStationsRepository {
  abstract findAll(): Promise<ChargingStation[]>;

  abstract findOne(
    options: FindOneOptions<ChargingStation>,
  ): Promise<ChargingStation>;

  abstract findNearbyChargingStations({
    company_id,
    latitude,
    longitude,
    radius,
  }: NearbyChargingStationsQuery): Promise<ChargingStation[]>;

  abstract create(
    createChargingStationDto: CreateChargingStationDto,
  ): Promise<ChargingStation>;

  abstract save(
    chargingStationDto: ChargingStationDto,
  ): Promise<ChargingStation>;

  abstract remove(chargingStation: ChargingStation): Promise<ChargingStation>;
}
