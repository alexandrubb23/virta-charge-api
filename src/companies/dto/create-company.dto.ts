import { IsNumber, IsObject, IsString } from 'class-validator';
import { ChargingStations } from '../entities/charging-stations.entity';

export class CreateCompanyDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly parent_company_id: number;

  @IsObject({ each: true })
  readonly charging_stations: ChargingStations[];
}
