import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Index } from 'typeorm';

export class CreateChargingStationDto {
  @ApiProperty({ description: 'The name of the charging station' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'The latitude of the charging station' })
  @IsLatitude()
  latitude: number;

  @ApiProperty({ description: 'The longitude of the charging station' })
  @IsLongitude()
  longitude: number;

  @ApiProperty({ description: 'The company id of the charging station' })
  @Index()
  @IsNumber()
  company_id: number;

  @ApiProperty({ description: 'The address of the charging station' })
  @IsString()
  address: string;
}
