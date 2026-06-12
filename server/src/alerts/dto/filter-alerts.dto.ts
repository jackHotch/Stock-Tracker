import { IsString, IsOptional, IsIn, IsNumberString, IsDateString, Matches } from 'class-validator';

export class FilterAlertsDto {
  @IsOptional()
  @IsString()
  @Matches(/^[A-Z]+$/, { message: 'ticker must be uppercase letters only' })
  ticker?: string;

  @IsOptional()
  @IsIn(['up', 'down'])
  direction?: 'up' | 'down';

  @IsOptional()
  @IsDateString()
  date_start_from?: string;

  @IsOptional()
  @IsDateString()
  date_start_to?: string;

  @IsOptional()
  @IsDateString()
  date_end_from?: string;

  @IsOptional()
  @IsDateString()
  date_end_to?: string;

  @IsOptional()
  @IsNumberString()
  pct_change_min?: string;

  @IsOptional()
  @IsNumberString()
  pct_change_max?: string;
}
