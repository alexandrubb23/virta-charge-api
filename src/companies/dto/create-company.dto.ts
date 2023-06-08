import { IsNumber, IsObject, IsString } from 'class-validator';
import { ChargingStation } from 'src/charging-stations/entities/charging-station.entity';

export class CreateCompanyDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly parentId: number;

  @IsObject({ each: true })
  readonly charging_stations: ChargingStation[];
}
