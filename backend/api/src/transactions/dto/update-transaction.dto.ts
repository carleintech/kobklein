import { PartialType } from '@nestjs/mapped-types';
import { TransactionStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;
}
