import { IsString, IsNumber, IsEnum, IsOptional, Min, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionTypeDto {
  TRANSFER = 'TRANSFER',
  PAYMENT = 'PAYMENT',
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  FEE = 'FEE',
  COMMISSION = 'COMMISSION',
  REFUND = 'REFUND',
  ADJUSTMENT = 'ADJUSTMENT',
  EXCHANGE = 'EXCHANGE',
}

export class CreateTransactionDto {
  @ApiProperty({ enum: TransactionTypeDto })
  @IsEnum(TransactionTypeDto)
  type: TransactionTypeDto;

  @ApiProperty({ description: 'Source account ID (debit from)' })
  @IsString()
  fromAccountId: string;

  @ApiProperty({ description: 'Destination account ID (credit to)' })
  @IsString()
  toAccountId: string;

  @ApiProperty({ description: 'Transaction amount', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ default: 'HTG' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Transaction description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'External reference (e.g., Stripe payment ID)', required: false })
  @IsString()
  @IsOptional()
  externalReference?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'IP address of initiator', required: false })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ description: 'User agent', required: false })
  @IsString()
  @IsOptional()
  userAgent?: string;
}
