// Authentication configuration for KobKlein

import type { NextAuthOptions } from 'next-auth';
import { FirestoreAdapter } from '@next-auth/firebase-adapter';
import { cert } from 'firebase-admin/app';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { db } from './firebase';
import { loginSchema } from './validators';
import { comparePasswords, getUserByEmail, createUser } from './auth-utils';
import type { User, UserRole } from '@/types';

export const authConfig: NextAuthOptions = {
  adapter: FirestoreAdapter({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  }),

  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          // Validate input
          const result = loginSchema.safeParse(credentials);
          if (!result.success) {
            return null;
          }

          // Get user from database
          const user = await getUserByEmail(credentials.email);
          if (!user) {
            return null;
          }

          // Check password
          const isValidPassword = await comparePasswords(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            return null;
          }

          // Return user object (without password)
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            role: user.role,
            isVerified: user.isVerified,
            isActive: user.isActive,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register',
    error: '/auth/error',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          role: user.role,
          isVerified: user.isVerified,
          isActive: user.isActive,
        };
      }

      return token;
    },

    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub,
          role: token.role as UserRole,
          isVerified: token.isVerified as boolean,
          isActive: token.isActive as boolean,
        },
      };
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      
      // Allows callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account, profile }) {
      console.log('User signed in:', { user: user.email, account: account?.provider });
    },
    
    async signOut({ session }) {
      console.log('User signed out:', session?.user?.email);
    },
  },

  debug: process.env.NODE_ENV === 'development',
};