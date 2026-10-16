import { IsBoolean, IsEmail, IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class SettingsDto {
  @IsBoolean()
  emails_enabled!: boolean;

  @IsEmail()
  @IsOptional()
  recipient_email_address?: string | null;

  @IsInt()
  @IsPositive()
  @IsOptional()
  lookback_days?: number | null;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  threshold_pct?: number | null;
}
