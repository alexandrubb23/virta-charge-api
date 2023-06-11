import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class SearchCharginStationsQueryDto {
  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsPositive()
  radius: number;

  @IsPositive()
  @IsOptional()
  company_id: number;
}
