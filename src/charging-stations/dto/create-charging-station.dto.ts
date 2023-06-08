import { IsLatitude, IsLongitude, IsNumber, IsString } from 'class-validator';
import { Index } from 'typeorm';

export class CreateChargingStationDto {
  @IsString()
  name: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @Index()
  @IsNumber()
  company_id: number;

  @IsString()
  address: string;
}
