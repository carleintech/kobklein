// File: kobklein/web/src/types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "@/lib/types";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      emailVerified: boolean;
      phone?: string;
      location?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: UserRole;
    emailVerified: boolean;
    phone?: string;
    location?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    emailVerified: boolean;
    phone?: string;
    location?: string;
  }
}