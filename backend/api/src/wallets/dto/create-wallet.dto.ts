import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export enum Currency {
  HTG = 'HTG',
  USD = 'USD',
  EUR = 'EUR',
}

export class CreateWalletDto {
  @ApiProperty({ description: 'Wallet name' })
  @IsString()
  name: string;

  @ApiProperty({ enum: Currency, description: 'Wallet currency' })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ description: 'Initial balance', required: false })
  @IsOptional()
  @IsNumber()
  @Min(0)
  initialBalance?: number;

  @ApiProperty({ description: 'User ID who owns the wallet' })
  @IsString()
  userId: string;
}
