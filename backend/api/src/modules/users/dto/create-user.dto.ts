import { UserRole, CurrencyCode } from '../../../types/database.types';

export class CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  country?: string;
  preferredCurrency?: CurrencyCode;
  role?: UserRole;
}
