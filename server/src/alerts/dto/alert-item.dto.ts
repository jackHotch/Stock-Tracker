import { IsInt, IsPositive, IsString, IsNotEmpty, MaxLength, IsNumber, IsIn, IsBoolean, IsDate, IsOptional, IsArray } from 'class-validator';

export class AlertItemDto {
  @IsInt()
  @IsPositive()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  ticker!: string;

  @IsNumber()
  pct_change!: number;

  @IsNumber()
  price_start!: number;

  @IsNumber()
  price_end!: number;

  @IsDate()
  date_start!: Date;

  @IsDate()
  date_end!: Date;

  @IsString()
  @IsIn(['up', 'down'])
  direction!: 'up' | 'down';

  @IsInt()
  @IsPositive()
  lookback_days!: number;

  @IsNumber()
  threshold_pct!: number;

  @IsArray()
  @IsOptional()
  news_headlines!: string[] | null;

  @IsBoolean()
  email_sent!: boolean;

  @IsDate()
  triggered_at!: Date;
}
