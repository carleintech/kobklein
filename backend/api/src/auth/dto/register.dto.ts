import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsISO31661Alpha2,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { CurrencyCode, UserRole } from '../../types/database.types';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'User password (minimum 8 characters)',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'John',
    description: 'User first name',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'User last name',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    example: '+50912345678',
    description: 'User phone number with country code',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: 'HT',
    description: 'Country code (ISO 3166-1 alpha-2)',
    required: false,
    default: 'HT',
  })
  @IsOptional()
  @IsISO31661Alpha2()
  country?: string;

  @ApiProperty({
    example: '+509',
    description: 'Country calling code',
    required: false,
  })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiProperty({
    example: 'Ouest',
    description: 'Region/State/Province',
    required: false,
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({
    example: 'America/Port-au-Prince',
    description: 'User timezone',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    example: '192.168.1.1',
    description: 'User IP address for geolocation',
    required: false,
  })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({
    example: UserRole.INDIVIDUAL,
    enum: UserRole,
    description: 'User role',
    required: false,
    default: UserRole.INDIVIDUAL,
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @ApiProperty({
    example: 'My Business',
    description: 'Business name (required for Merchants)',
    required: false,
  })
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiProperty({
    example: 'My Legal Business Name Inc.',
    description: 'Legal business name (required for Distributors)',
    required: false,
  })
  @IsOptional()
  @IsString()
  legalBusinessName?: string;

  @ApiProperty({
    example: 'BN-12345678',
    description: 'Business registration number (required for Distributors)',
    required: false,
  })
  @IsOptional()
  @IsString()
  businessRegistrationNumber?: string;

  @ApiProperty({
    example: '123 Main Street, Port-au-Prince, Haiti',
    description: 'Business address (required for Distributors)',
    required: false,
  })
  @IsOptional()
  @IsString()
  businessAddress?: string;

  @ApiProperty({
    example: 'HTG',
    enum: CurrencyCode,
    description: 'Preferred currency for the user',
    required: false,
    default: 'HTG',
  })
  @IsOptional()
  @IsEnum(CurrencyCode)
  preferredCurrency?: CurrencyCode;
}
