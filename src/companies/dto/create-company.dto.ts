import { IsNumber, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  readonly name: string;

  @IsNumber()
  readonly parent_company_id: number;
}
