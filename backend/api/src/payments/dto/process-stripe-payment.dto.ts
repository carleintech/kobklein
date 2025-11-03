import { IsNotEmpty, IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class ProcessStripePaymentDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  paymentMethodId: string;

  @IsOptional()
  @IsString()
  description?: string;
}
