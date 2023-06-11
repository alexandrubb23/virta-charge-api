import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'The name of the company' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The parent company id' })
  @IsNumber()
  readonly parentId: number;
}
