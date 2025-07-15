// src/lib/types.ts

export type UserRole = "admin" | "merchant" | "distributor" | "client" | "diaspora";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
}
