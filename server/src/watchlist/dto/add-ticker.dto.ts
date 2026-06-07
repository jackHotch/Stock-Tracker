import { IsString, IsNotEmpty, MaxLength, Matches } from 'class-validator';

export class AddTickerDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  @Matches(/^[A-Z]+$/, { message: 'ticker must be uppercase letters only' })
  ticker!: string;
}
