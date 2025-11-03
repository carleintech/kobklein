import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { CreateWalletDto } from './create-wallet.dto';

export class UpdateWalletDto extends PartialType(CreateWalletDto) {
  @ApiProperty({ description: 'Whether wallet is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Daily spending limit', required: false })
  @IsOptional()
  @IsNumber()
  dailyLimit?: number;

  @ApiProperty({ description: 'Monthly spending limit', required: false })
  @IsOptional()
  @IsNumber()
  monthlyLimit?: number;
}
