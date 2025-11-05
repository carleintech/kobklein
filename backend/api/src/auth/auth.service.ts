import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Removed Prisma dependency - using Supabase directly
import {
  CurrencyCode,
  KycStatus,
  KycTier,
  UserRole,
  UserStatus,
} from '../types/database.types';
import { extractError } from '../utils/error.utils';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private supabase: SupabaseClient;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.supabase = createClient(
      this.configService.get<string>('SUPABASE_URL'),
      this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY'),
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );
  }

  async register(registerDto: RegisterDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      country = 'HT',
      countryCode,
      region,
      timezone,
      ipAddress,
      role = UserRole.INDIVIDUAL,
      businessName,
      legalBusinessName,
      businessRegistrationNumber,
      businessAddress,
      preferredCurrency = 'HTG' as CurrencyCode,
    } = registerDto;

    this.logger.log(`Registration attempt for email: ${email}`);

    // Validate role-specific required fields
    if (role === UserRole.MERCHANT && !businessName) {
      throw new ConflictException('Business name is required for Merchants');
    }

    if (role === UserRole.DISTRIBUTOR) {
      if (!legalBusinessName) {
        throw new ConflictException(
          'Legal business name is required for Distributors',
        );
      }
      if (!businessRegistrationNumber) {
        throw new ConflictException(
          'Business registration number is required for Distributors',
        );
      }
      if (!businessAddress) {
        throw new ConflictException(
          'Business address is required for Distributors',
        );
      }
    }

    // Check for existing email
    const { data: existingEmail } = await this.supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      throw new ConflictException(
        'An account with this email already exists. Please sign in or use a different email.',
      );
    }

    // Check for existing phone
    const { data: existingPhone } = await this.supabase
      .from('users')
      .select('id')
      .eq('phone', phone)
      .single();

    if (existingPhone) {
      throw new ConflictException(
        'An account with this phone number already exists. Please use a different phone number.',
      );
    }

    try {
      // Create user in Supabase Auth first
      const { data: authData, error: authError } =
        await this.supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: false, // Will be verified via OTP
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            phone,
            country,
            country_code: countryCode,
            region,
            timezone,
            ip_address: ipAddress,
            role,
            business_name: businessName,
            legal_business_name: legalBusinessName,
            business_registration_number: businessRegistrationNumber,
            business_address: businessAddress,
            preferred_currency: preferredCurrency,
          },
        });

      if (authError) {
        this.logger.error(`Supabase auth error: ${authError.message}`);

        // Provide helpful error message for duplicate email
        if (authError.message.includes('already been registered')) {
          throw new ConflictException(
            'An account with this email already exists. Please sign in or use a different email.',
          );
        }

        throw new ConflictException(authError.message);
      }

      // The user profile should be automatically created via database trigger
      // Wait a moment for trigger to complete
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify user was created in our schema
      let user = await this.getUserProfile(authData.user.id);

      // If trigger didn't fire (common in local dev), create user record manually
      if (!user) {
        this.logger.warn(
          `User trigger didn't fire for ${authData.user.id}, creating manually`,
        );

        // Create minimal user record (only required fields to avoid schema mismatches)
        const { data: newUser, error: userError } = await this.supabase
          .from('users')
          .insert({
            id: authData.user.id,
            email,
            first_name: firstName,
            last_name: lastName,
            phone,
            country,
            country_code: countryCode,
            region,
            timezone,
            ip_address: ipAddress,
            status: UserStatus.ACTIVE,
          })
          .select()
          .single();

        if (userError) {
          this.logger.error(
            `Failed to create user record: ${userError.message}`,
          );
          // Still throw error but don't block - user exists in Auth
          throw new ConflictException('Failed to create user profile');
        }

        user = {
          ...newUser,
          user_roles: [],
          user_profiles: null,
          user_wallets: [],
        };
      }

      this.logger.log(`User registered successfully: ${user.id}`);

      // Generate custom JWT with enhanced claims
      const token = await this.generateAccessToken(user);

      return {
        user: this.sanitizeUserResponse(user),
        token,
        message: 'Registration successful. Please verify your email.',
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Registration failed for ${email}:`, err.message);
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    this.logger.log(`Login attempt for email: ${email}`);

    try {
      // Authenticate with Supabase
      const { data: authData, error: authError } =
        await this.supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (authError) {
        this.logger.warn(`Login failed for ${email}: ${authError.message}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Get user profile with role information
      const user = await this.getUserProfile(authData.user.id);

      if (!user) {
        throw new UnauthorizedException('User profile not found');
      }

      // Check if user account is active
      if (user.status !== UserStatus.ACTIVE) {
        throw new ForbiddenException(`Account is ${user.status.toLowerCase()}`);
      }

      // Update last login timestamp
      await this.updateLastLogin(user.id);

      this.logger.log(`User logged in successfully: ${user.id}`);

      // Generate enhanced JWT token
      const token = await this.generateAccessToken(user);

      return {
        user: this.sanitizeUserResponse(user),
        token,
        message: 'Login successful',
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Login error for ${email}:`, err.message);
      throw error;
    }
  }

  async validateUser(userId: string) {
    const user = await this.getUserProfile(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new ForbiddenException(`Account is ${user.status.toLowerCase()}`);
    }

    return user;
  }

  async refreshToken(userId: string) {
    const user = await this.validateUser(userId);
    const token = await this.generateAccessToken(user);
    return { token };
  }

  async logout(userId: string) {
    // Invalidate Supabase session
    const { error } = await this.supabase.auth.admin.signOut(userId);

    if (error) {
      this.logger.error('Supabase logout error:', error);
    }

    return { message: 'Logged out successfully' };
  }

  // Helper Methods for Enhanced Authentication

  private async getUserProfile(userId: string) {
    try {
      // First, get the basic user record
      const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        const err = extractError(error);
        this.logger.error(`Failed to fetch user profile: ${err.message}`);
        return null;
      }

      // TODO: Add related data queries when tables are properly set up
      // For now, return the basic user with empty arrays for related data
      return {
        ...data,
        user_roles: [],
        user_profiles: null,
        user_wallets: [],
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Database error fetching user: ${err.message}`);
      return null;
    }
  }

  private async generateAccessToken(user: any) {
    const roles = user.user_roles?.map((ur: any) => ur.role) || [
      UserRole.INDIVIDUAL,
    ];
    const primaryWallet = user.user_wallets?.find(
      (w: any) => w.wallet_type === 'PRIMARY',
    );

    const payload = {
      sub: user.id,
      email: user.email,
      roles,
      primaryRole: roles[0] || UserRole.INDIVIDUAL,
      status: user.status,
      kycStatus: user.user_profiles?.kyc_status || KycStatus.PENDING,
      kycTier: user.user_profiles?.kyc_tier || KycTier.TIER_0,
      primaryWalletId: primaryWallet?.id,
      country: user.country,
      preferredCurrency: user.preferred_currency,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
    };

    return this.jwtService.sign(payload);
  }

  private sanitizeUserResponse(user: any) {
    const roles = user.user_roles?.map((ur: any) => ur.role) || [];
    const profile = user.user_profiles || {};
    const wallets = user.user_wallets || [];

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      country: user.country,
      preferredCurrency: user.preferred_currency,
      status: user.status,
      roles,
      primaryRole: roles[0] || UserRole.INDIVIDUAL,
      kycStatus: profile.kyc_status || KycStatus.PENDING,
      kycTier: profile.kyc_tier || KycTier.TIER_0,
      wallets: wallets.map((w: any) => ({
        id: w.id,
        currency: w.currency,
        balance: parseFloat(w.balance || '0'),
        status: w.status,
        type: w.wallet_type,
      })),
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      lastLoginAt: user.last_login_at,
    };
  }

  private async updateLastLogin(userId: string) {
    try {
      await this.supabase
        .from('users')
        .update({ last_login_at: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      const err = extractError(error);
      this.logger.warn(
        `Failed to update last login for ${userId}:`,
        err.message,
      );
    }
  }

  // Role and Permission Methods

  async assignRole(userId: string, role: UserRole, grantedBy: string) {
    try {
      const { error } = await this.supabase.from('user_roles').insert({
        user_id: userId,
        role,
        granted_by: grantedBy,
        granted_at: new Date().toISOString(),
      });

      if (error) {
        const err = extractError(error);
        throw new BadRequestException(`Failed to assign role: ${err.message}`);
      }

      this.logger.log(
        `Role ${role} assigned to user ${userId} by ${grantedBy}`,
      );
      return { success: true };
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Role assignment error:`, err.message);
      throw error;
    }
  }

  async revokeRole(userId: string, role: UserRole) {
    try {
      const { error } = await this.supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) {
        const err = extractError(error);
        throw new BadRequestException(`Failed to revoke role: ${err.message}`);
      }

      this.logger.log(`Role ${role} revoked from user ${userId}`);
      return { success: true };
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Role revocation error:`, err.message);
      throw error;
    }
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      const { data, error } = await this.supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .is('expires_at', null)
        .or('expires_at.gt.' + new Date().toISOString());

      if (error) {
        const err = extractError(error);
        this.logger.error(`Failed to fetch user roles: ${err.message}`);
        return [UserRole.INDIVIDUAL];
      }

      const roles = data.map((r: any) => r.role);
      return roles.length > 0 ? roles : [UserRole.INDIVIDUAL];
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Role fetch error:`, err.message);
      return [UserRole.INDIVIDUAL];
    }
  }

  async hasRole(userId: string, role: UserRole): Promise<boolean> {
    const roles = await this.getUserRoles(userId);
    return roles.includes(role);
  }

  async hasAnyRole(userId: string, roles: UserRole[]): Promise<boolean> {
    const userRoles = await this.getUserRoles(userId);
    return roles.some((role) => userRoles.includes(role));
  }

  // Email and Password Management

  async sendEmailVerification(userId: string) {
    try {
      const userProfile = await this.getUserProfile(userId);
      if (!userProfile) {
        throw new BadRequestException('User not found');
      }

      const { error } = await this.supabase.auth.admin.generateLink({
        type: 'signup',
        email: userProfile.email,
        password: 'temp-password', // Required by API but won't be used for verification
      });

      if (error) {
        const err = extractError(error);
        throw new BadRequestException(
          `Failed to send verification: ${err.message}`,
        );
      }

      return { success: true, message: 'Verification email sent' };
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Email verification error:`, err.message);
      throw error;
    }
  }

  async resetPassword(email: string) {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${this.configService.get('APP_URL')}/auth/reset-password`,
      });

      if (error) {
        const err = extractError(error);
        throw new BadRequestException(
          `Failed to send reset email: ${err.message}`,
        );
      }

      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Password reset error:`, err.message);
      throw error;
    }
  }

  async updatePassword(userId: string, newPassword: string) {
    try {
      const { error } = await this.supabase.auth.admin.updateUserById(userId, {
        password: newPassword,
      });

      if (error) {
        const err = extractError(error);
        throw new BadRequestException(
          `Failed to update password: ${err.message}`,
        );
      }

      this.logger.log(`Password updated for user ${userId}`);
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Password update error:`, err.message);
      throw error;
    }
  }
}
