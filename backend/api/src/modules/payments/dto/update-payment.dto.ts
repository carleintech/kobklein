import { payment_status } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(payment_status)
  status?: payment_status;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  metadata?: string;
}
