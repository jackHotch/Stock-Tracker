import { IsInt, IsPositive, IsString, IsNotEmpty, MaxLength, IsDate } from 'class-validator';

export class WatchlistItem {
  @IsInt()
  @IsPositive()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  ticker!: string;

  @IsDate()
  added_at!: Date;
}
