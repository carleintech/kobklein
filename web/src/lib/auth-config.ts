// File: kobklein/web/src/lib/auth-config.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { comparePassword, getUserByEmail, getDashboardRoute } from "./auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // Email/Password Provider
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          // Get user from database
          const user = await getUserByEmail(credentials.email);
          
          if (!user) {
            throw new Error("No user found with this email");
          }

          // Check if email is verified
          if (!user.isVerified) {
            throw new Error("Please verify your email before logging in");
          }

          // Check password
          const isPasswordValid = await comparePassword(
            credentials.password,
            user.passwordHash
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Return user object
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            isVerified: user.isVerified,
            profile: {
              phone: user.phone,
              location: user.location,
              businessName: user.businessName,
              region: user.region,
              permissions: user.permissions || [],
            },
          };
        } catch (error) {
          console.error("Authorization error:", error);
          throw new Error(error instanceof Error ? error.message : "Authentication failed");
        }
      },
    }),

    // Google OAuth Provider (optional - only if you have credentials)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
              },
            },
          }),
        ]
      : []),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.profile = user.profile;
      }

      // Handle Google OAuth
      if (account?.provider === "google" && user) {
        try {
          // Check if user exists in our database
          let existingUser = await getUserByEmail(user.email!);

          if (!existingUser) {
            // For now, we'll assign them as a client
            token.role = "client";
            token.isVerified = true;
            token.profile = {
              phone: "",
              location: "Haiti",
              permissions: [],
            };
          } else {
            token.id = existingUser.id;
            token.role = existingUser.role;
            token.isVerified = existingUser.isVerified;
            token.profile = existingUser.profile;
          }
        } catch (error) {
          console.error("Google OAuth callback error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as any;
        session.user.isVerified = token.isVerified as boolean;
        session.user.profile = token.profile as any;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
    verifyRequest: "/auth/verify-email",
    newUser: "/auth/welcome",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,

  debug: false, // Disable debug to reduce console warnings
};