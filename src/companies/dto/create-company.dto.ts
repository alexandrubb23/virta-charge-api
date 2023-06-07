import { IsNumber, IsObject, IsString } from 'class-validator';
import { ChargingStation } from '../entities/charging-station.entity';

export class CreateCompanyDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly parentId: number;

  @IsObject({ each: true })
  readonly charging_stations: ChargingStation[];
}
