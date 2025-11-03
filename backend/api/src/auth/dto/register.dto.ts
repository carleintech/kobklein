import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '+50912345678' })
  @IsPhoneNumber('HT')
  phone: string;

  @ApiProperty({
    example: 'CLIENT',
    enum: ['CLIENT', 'MERCHANT', 'DISTRIBUTOR', 'DIASPORA', 'ADMIN'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['CLIENT', 'MERCHANT', 'DISTRIBUTOR', 'DIASPORA', 'ADMIN'])
  role?: string;
}
