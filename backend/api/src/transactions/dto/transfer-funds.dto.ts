import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class TransferFundsDto {
  @IsNotEmpty()
  @IsString()
  receiverIdentifier: string; // Can be email, phone, or user ID

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  pin?: string; // For secure transfers

  @IsOptional()
  @IsString()
  walletId?: string; // Source wallet ID
}
