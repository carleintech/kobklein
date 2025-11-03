import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
  IsISO31661Alpha2,
} from 'class-validator';
import { CurrencyCode } from '../../types/database.types';

export class RegisterDto {
  @ApiProperty({ 
    example: 'john.doe@example.com',
    description: 'User email address'
  })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    example: 'StrongPassword123!',
    description: 'User password (minimum 8 characters)'
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ 
    example: 'John',
    description: 'User first name'
  })
  @IsString()
  firstName: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'User last name'
  })
  @IsString()
  lastName: string;

  @ApiProperty({ 
    example: '+50912345678',
    description: 'User phone number with country code'
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'HT',
    description: 'Country code (ISO 3166-1 alpha-2)',
    required: false,
    default: 'HT'
  })
  @IsOptional()
  @IsISO31661Alpha2()
  country?: string;

  @ApiProperty({
    example: 'HTG',
    enum: CurrencyCode,
    description: 'Preferred currency for the user',
    required: false,
    default: 'HTG'
  })
  @IsOptional()
  @IsEnum(CurrencyCode)
  preferredCurrency?: CurrencyCode;
}
