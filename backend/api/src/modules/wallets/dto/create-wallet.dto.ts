import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWalletDto {
  @ApiProperty({ description: 'User ID who owns the wallet', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Currency code', enum: ['HTG', 'USD', 'EUR'], default: 'HTG' })
  @IsEnum(['HTG', 'USD', 'EUR'])
  @IsOptional()
  currency?: 'HTG' | 'USD' | 'EUR';

  @ApiProperty({ description: 'Optional wallet name/label', example: 'My Main Wallet', required: false })
  @IsString()
  @IsOptional()
  walletName?: string;
}
