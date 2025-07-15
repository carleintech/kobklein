// File: kobklein/web/src/types/next-auth.d.ts

import NextAuth, { DefaultSession } from "next-auth";
import { UserRole } from "@/lib/types";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "client" | "merchant" | "distributor" | "diaspora" | "admin" | "super_admin" | "regional_manager" | "support_agent";
      isVerified: boolean;
      profile?: {
        phone?: string;
        location?: string;
        businessName?: string;
        region?: string;
        permissions?: string[];
      };
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "client" | "merchant" | "distributor" | "diaspora" | "admin" | "super_admin" | "regional_manager" | "support_agent";
    isVerified: boolean;
    profile?: {
      phone?: string;
      location?: string;
      businessName?: string;
      region?: string;
      permissions?: string[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "client" | "merchant" | "distributor" | "diaspora" | "admin" | "super_admin" | "regional_manager" | "support_agent";
    isVerified: boolean;
    profile?: {
      phone?: string;
      location?: string;
      businessName?: string;
      region?: string;
      permissions?: string[];
    };
  }
}