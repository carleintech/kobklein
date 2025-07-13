// Authentication utilities for KobKlein

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { User, UserRole, RegisterFormData } from '@/types';
import { generateId } from './utils';

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function comparePasswords(
  password: string, 
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// JWT utilities
export function generateToken(userId: string, role: UserRole): string {
  const secret = process.env.JWT_SECRET || 'kobklein-secret-key';
  return jwt.sign(
    { userId, role },
    secret,
    { expiresIn: '30d' }
  );
}

export function verifyToken(token: string): { userId: string; role: UserRole } | null {
  try {
    const secret = process.env.JWT_SECRET || 'kobklein-secret-key';
    const decoded = jwt.verify(token, secret) as any;
    return { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    return null;
  }
}

// User management
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email.toLowerCase()));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      return null;
    }
    
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

export async function getUserById(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return { id: userDoc.id, ...userDoc.data() } as User;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

export async function createUser(userData: RegisterFormData): Promise<User> {
  try {
    const userId = generateId('user');
    const hashedPassword = await hashPassword(userData.password);
    
    const newUser: Omit<User, 'id'> = {
      email: userData.email.toLowerCase(),
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role,
      isVerified: false,
      isActive: true,
      language: userData.language,
      country: userData.country,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    // Create user document
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...newUser,
      password: hashedPassword, // Store hashed password
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    // Create wallet for the user
    await createUserWallet(userId);
    
    return { id: userId, ...newUser };
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user account');
  }
}

export async function updateUser(
  userId: string, 
  updates: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user');
  }
}

// Wallet management
export async function createUserWallet(userId: string): Promise<void> {
  try {
    const walletId = generateId('wallet');
    const walletRef = doc(db, 'wallets', walletId);
    
    await setDoc(walletRef, {
      id: walletId,
      userId,
      balance: 0,
      currency: 'HTG',
      isLocked: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw new Error('Failed to create user wallet');
  }
}

// Role and permission utilities
export function hasPermission(userRole: UserRole, permission: string): boolean {
  const rolePermissions: Record<UserRole, string[]> = {
    client: ['wallet:read', 'wallet:send', 'wallet:receive', 'transactions:read'],
    merchant: ['wallet:read', 'wallet:receive', 'transactions:read', 'pos:use', 'payout:request'],
    distributor: ['cards:issue', 'refill:process', 'users:onboard', 'commission:view'],
    diaspora: ['refill:send', 'beneficiaries:manage', 'auto-refill:configure'],
    admin: ['users:manage', 'transactions:view', 'reports:generate', 'system:configure'],
    super_admin: ['*'], // All permissions
  };
  
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes('*') || permissions.includes(permission);
}

export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routeAccess: Record<string, UserRole[]> = {
    '/client': ['client'],
    '/merchant': ['merchant'],
    '/distributor': ['distributor'],
    '/diaspora': ['diaspora'],
    '/admin': ['admin', 'super_admin'],
  };
  
  for (const [basePath, allowedRoles] of Object.entries(routeAccess)) {
    if (route.startsWith(basePath)) {
      return allowedRoles.includes(userRole);
    }
  }
  
  return true; // Public routes
}

// Email verification
export async function sendVerificationEmail(email: string): Promise<void> {
  // TODO: Implement email verification
  // This would integrate with your email service (SendGrid, Mailgun, etc.)
  console.log('Sending verification email to:', email);
}

// Password reset
export async function sendPasswordResetEmail(email: string): Promise<void> {
  // TODO: Implement password reset email
  console.log('Sending password reset email to:', email);
}