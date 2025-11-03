export class UpdateProfileDto {
  dateOfBirth?: string;
  nationality?: string;
  occupation?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
}