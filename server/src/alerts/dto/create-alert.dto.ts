import { IsString, IsNotEmpty, MaxLength, IsNumber, IsPositive, IsInt, IsIn, IsOptional, IsArray, IsDateString, Matches } from 'class-validator';

export class CreateAlertDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Matches(/^[A-Z]+$/, { message: 'ticker must be uppercase letters only' })
  ticker!: string;

  @IsNumber()
  pct_change!: number;

  @IsNumber()
  @IsPositive()
  price_start!: number;

  @IsNumber()
  @IsPositive()
  price_end!: number;

  @IsDateString()
  date_start!: string;

  @IsDateString()
  date_end!: string;

  @IsString()
  @IsIn(['up', 'down'])
  direction!: 'up' | 'down';

  @IsInt()
  @IsPositive()
  lookback_days!: number;

  @IsNumber()
  @IsPositive()
  threshold_pct!: number;

  @IsArray()
  @IsOptional()
  news_headlines?: string[] | null;
}
