import { UserStatus, CurrencyCode } from '../../../types/database.types';

export class UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  country?: string;
  preferredCurrency?: CurrencyCode;
  status?: UserStatus;
}
