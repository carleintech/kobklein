import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Min } from 'class-validator';
import { Currency } from './create-wallet.dto';

export enum TransferType {
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
}

export class TransferFundsDto {
  @ApiProperty({ description: 'Source wallet ID' })
  @IsString()
  fromWalletId: string;

  @ApiProperty({ description: 'Destination wallet ID' })
  @IsString()
  toWalletId: string;

  @ApiProperty({ description: 'Transfer amount' })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: Currency, description: 'Currency for transfer' })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({ enum: TransferType, description: 'Transfer type' })
  @IsEnum(TransferType)
  transferType: TransferType;

  @ApiProperty({ description: 'Transfer description', required: false })
  @IsString()
  description?: string;
}
