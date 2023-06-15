import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { IsPositiveOrZero } from 'src/common/decorators/is-positive-or-zero.decorator';

export class CreateCompanyDto {
  @ApiProperty({ description: 'The name of the company' })
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty({ description: 'The parent company id' })
  @IsPositiveOrZero()
  @IsNumber()
  readonly parentId: number;
}
