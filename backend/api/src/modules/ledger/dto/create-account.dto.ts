import { IsString, IsEnum, IsOptional, IsBoolean, IsObject, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum AccountTypeDto {
  ASSET = 'ASSET',
  LIABILITY = 'LIABILITY',
  EQUITY = 'EQUITY',
  REVENUE = 'REVENUE',
  EXPENSE = 'EXPENSE',
}

export enum OwnerTypeDto {
  USER = 'USER',
  MERCHANT = 'MERCHANT',
  DISTRIBUTOR = 'DISTRIBUTOR',
  DIASPORA = 'DIASPORA',
  SYSTEM = 'SYSTEM',
}

export class CreateAccountDto {
  @ApiProperty({ description: 'Account name' })
  @IsString()
  accountName: string;

  @ApiProperty({ enum: AccountTypeDto })
  @IsEnum(AccountTypeDto)
  accountType: AccountTypeDto;

  @ApiProperty({ description: 'Account subtype', required: false })
  @IsString()
  @IsOptional()
  subType?: string;

  @ApiProperty({ description: 'Owner user ID', required: false })
  @IsUUID()
  @IsOptional()
  ownerId?: string;

  @ApiProperty({ enum: OwnerTypeDto, required: false })
  @IsEnum(OwnerTypeDto)
  @IsOptional()
  ownerType?: OwnerTypeDto;

  @ApiProperty({ default: 'HTG' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ description: 'Is this a system account?', default: false })
  @IsBoolean()
  @IsOptional()
  isSystemAccount?: boolean;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @ApiProperty({ description: 'Account notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
