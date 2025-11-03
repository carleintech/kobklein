import { PartialType } from '@nestjs/swagger';
import { KYCStatus } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsEnum(KYCStatus)
  kycStatus?: KYCStatus;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
