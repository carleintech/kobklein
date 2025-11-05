import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  CurrencyCode,
  KycStatus,
  KycTier,
  PaginatedResponse,
  UserProfile,
  UserRole,
  UserStatus,
} from '../types/database.types';
import { extractError } from '../utils/error.utils';
import { CreateUserDto } from './dto/create-user.dto';
import { KycSubmissionDto } from './dto/kyc-submission.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private supabase: SupabaseClient;

  constructor(private readonly configService: ConfigService) {
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

  async create(createUserDto: CreateUserDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      phone,
      country = 'HT',
      preferredCurrency = 'HTG' as CurrencyCode,
      role = UserRole.INDIVIDUAL,
    } = createUserDto;

    this.logger.log(`Creating user: ${email}`);

    try {
      // Create user in Supabase Auth
      const { data: authData, error: authError } =
        await this.supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: false,
          user_metadata: {
            first_name: firstName,
            last_name: lastName,
            phone,
            country,
            preferred_currency: preferredCurrency,
            role,
          },
        });

      if (authError) {
        this.logger.error(`Supabase auth error: ${authError.message}`);
        throw new BadRequestException(authError.message);
      }

      // Wait for database trigger to create profile
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Get the created user profile
      const userProfile = await this.getUserProfile(authData.user.id);

      if (!userProfile) {
        throw new BadRequestException('Failed to create user profile');
      }

      this.logger.log(`User created successfully: ${userProfile.id}`);
      return this.sanitizeUserResponse(userProfile);
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`User creation failed for ${email}:`, err.message);
      throw error;
    }
  }

  async findAll(params?: {
    skip?: number;
    take?: number;
    role?: UserRole;
    status?: UserStatus;
    kycStatus?: KycStatus;
    country?: string;
    search?: string;
  }): Promise<PaginatedResponse<UserProfile>> {
    const {
      skip = 0,
      take = 10,
      role,
      status,
      kycStatus,
      country,
      search,
    } = params || {};

    this.logger.log(`Finding users with params:`, params);

    try {
      let query = this.supabase.from('users').select(
        `
          *,
          user_roles(
            role,
            granted_by,
            granted_at,
            expires_at
          ),
          user_profiles(
            date_of_birth,
            nationality,
            occupation,
            address,
            kyc_status,
            kyc_tier,
            kyc_verified_at
          ),
          user_wallets(
            id,
            currency,
            balance,
            status,
            wallet_type
          )
        `,
        { count: 'exact' },
      );

      // Apply filters
      if (status) {
        query = query.eq('status', status);
      }
      if (country) {
        query = query.eq('country', country);
      }
      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`,
        );
      }

      // Apply role filter through user_roles join
      if (role) {
        query = query.eq('user_roles.role', role);
      }

      // Apply KYC status filter through user_profiles join
      if (kycStatus) {
        query = query.eq('user_profiles.kyc_status', kycStatus);
      }

      // Apply pagination and ordering
      const { data, count, error } = await query
        .range(skip, skip + take - 1)
        .order('created_at', { ascending: false });

      if (error) {
        const err = extractError(error);
        this.logger.error('Error fetching users:', err.message);
        throw new BadRequestException(`Failed to fetch users: ${err.message}`);
      }

      const sanitizedUsers = (data || []).map((user) =>
        this.sanitizeUserResponse(user),
      );

      return {
        success: true,
        data: sanitizedUsers,
        pagination: {
          page: Math.floor(skip / take) + 1,
          limit: take,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / take),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error in findAll:', err.message);
      throw error;
    }
  }

  async findOne(id: string): Promise<UserProfile> {
    this.logger.log(`Finding user: ${id}`);

    try {
      const userProfile = await this.getUserProfile(id);

      if (!userProfile) {
        throw new NotFoundException('User not found');
      }

      return this.sanitizeUserResponse(userProfile);
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Error finding user ${id}:`, err.message);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    this.logger.log(`Finding user by email: ${email}`);

    try {
      const { data, error } = await this.supabase
        .from('users')
        .select(
          `
          *,
          user_roles(
            role,
            granted_by,
            granted_at,
            expires_at
          ),
          user_profiles(
            date_of_birth,
            nationality,
            occupation,
            address,
            kyc_status,
            kyc_tier,
            kyc_verified_at
          ),
          user_wallets(
            id,
            currency,
            balance,
            status,
            wallet_type
          )
        `,
        )
        .eq('email', email)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // User not found
        }
        const err = extractError(error);
        throw new BadRequestException(`Failed to find user: ${err.message}`);
      }

      return data ? this.sanitizeUserResponse(data) : null;
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Error finding user by email ${email}:`, err.message);
      throw error;
    }
  }

  // Helper Methods

  private async getUserProfile(userId: string) {
    try {
      const { data, error } = await this.supabase
        .from('users')
        .select(
          `
          *,
          user_roles(
            role,
            granted_by,
            granted_at,
            expires_at
          ),
          user_profiles(
            date_of_birth,
            nationality,
            occupation,
            address,
            kyc_status,
            kyc_tier,
            kyc_verified_at,
            kyc_documents
          ),
          user_wallets(
            id,
            currency,
            balance,
            status,
            wallet_type
          )
        `,
        )
        .eq('id', userId)
        .single();

      if (error) {
        const err = extractError(error);
        this.logger.error(`Failed to fetch user profile: ${err.message}`);
        return null;
      }

      return data;
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Database error fetching user: ${err.message}`);
      return null;
    }
  }

  private sanitizeUserResponse(user: any): UserProfile {
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserProfile> {
    this.logger.log(`Updating user: ${id}`);

    try {
      // Verify user exists
      const existingUser = await this.getUserProfile(id);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const { firstName, lastName, phone, country, preferredCurrency, status } =
        updateUserDto;

      // Update user basic info
      const { data, error } = await this.supabase
        .from('users')
        .update({
          ...(firstName && { first_name: firstName }),
          ...(lastName && { last_name: lastName }),
          ...(phone && { phone }),
          ...(country && { country }),
          ...(preferredCurrency && { preferred_currency: preferredCurrency }),
          ...(status && { status }),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        const err = extractError(error);
        this.logger.error(`Error updating user ${id}:`, err.message);
        throw new BadRequestException(`Failed to update user: ${err.message}`);
      }

      this.logger.log(`User updated successfully: ${id}`);

      // Return updated profile
      const updatedProfile = await this.getUserProfile(id);
      return this.sanitizeUserResponse(updatedProfile);
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`User update failed for ${id}:`, err.message);
      throw error;
    }
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<UserProfile> {
    this.logger.log(`Updating profile for user: ${userId}`);

    try {
      // Verify user exists
      const existingUser = await this.getUserProfile(userId);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const { dateOfBirth, nationality, occupation, address } =
        updateProfileDto;

      // Update or create user profile
      const { data, error } = await this.supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          ...(dateOfBirth && { date_of_birth: dateOfBirth }),
          ...(nationality && { nationality }),
          ...(occupation && { occupation }),
          ...(address && { address }),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        const err = extractError(error);
        this.logger.error(`Error updating profile for ${userId}:`, err.message);
        throw new BadRequestException(
          `Failed to update profile: ${err.message}`,
        );
      }

      this.logger.log(`Profile updated successfully for user: ${userId}`);

      // Return updated user profile
      const updatedUser = await this.getUserProfile(userId);
      return this.sanitizeUserResponse(updatedUser);
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Profile update failed for ${userId}:`, err.message);
      throw error;
    }
  }

  async updateKYCStatus(
    userId: string,
    status: KycStatus,
    reviewedBy: string,
    reviewNotes?: string,
  ): Promise<UserProfile> {
    this.logger.log(`Updating KYC status for user ${userId} to ${status}`);

    try {
      // Verify user exists
      const existingUser = await this.getUserProfile(userId);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      // Determine KYC tier based on status
      let kycTier = KycTier.TIER_0;
      let verifiedAt = null;

      if (status === KycStatus.APPROVED) {
        verifiedAt = new Date().toISOString();
        kycTier = KycTier.TIER_1; // Default to TIER_1 on approval
      }

      // Update user profile with KYC information
      const { data, error } = await this.supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          kyc_status: status,
          kyc_tier: kycTier,
          kyc_verified_at: verifiedAt,
          kyc_reviewed_by: reviewedBy,
          kyc_review_notes: reviewNotes,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        const err = extractError(error);
        this.logger.error(
          `Error updating KYC status for ${userId}:`,
          err.message,
        );
        throw new BadRequestException(
          `Failed to update KYC status: ${err.message}`,
        );
      }

      this.logger.log(`KYC status updated successfully for user: ${userId}`);

      // Return updated user profile
      const updatedUser = await this.getUserProfile(userId);
      return this.sanitizeUserResponse(updatedUser);
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`KYC status update failed for ${userId}:`, err.message);
      throw error;
    }
  }

  async submitKycDocuments(
    userId: string,
    kycSubmissionDto: KycSubmissionDto,
  ): Promise<UserProfile> {
    this.logger.log(`Processing KYC submission for user: ${userId}`);

    try {
      // Verify user exists
      const existingUser = await this.getUserProfile(userId);
      if (!existingUser) {
        throw new NotFoundException('User not found');
      }

      const { documentType, documentNumber, documents } = kycSubmissionDto;

      // Update profile with submitted documents
      const { data, error } = await this.supabase
        .from('user_profiles')
        .upsert({
          user_id: userId,
          kyc_status: KycStatus.IN_REVIEW,
          kyc_documents: {
            document_type: documentType,
            document_number: documentNumber,
            documents: documents,
            submitted_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        const err = extractError(error);
        this.logger.error(`Error submitting KYC for ${userId}:`, err.message);
        throw new BadRequestException(`Failed to submit KYC: ${err.message}`);
      }

      this.logger.log(`KYC submitted successfully for user: ${userId}`);

      // Return updated user profile
      const updatedUser = await this.getUserProfile(userId);
      return this.sanitizeUserResponse(updatedUser);
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`KYC submission failed for ${userId}:`, err.message);
      throw error;
    }
  }

  async updateUserStatus(userId: string, isActive: boolean, reason?: string) {
    this.logger.log(
      `Updating user status: ${userId} to ${isActive ? 'active' : 'inactive'}`,
    );

    try {
      const status = isActive ? UserStatus.ACTIVE : UserStatus.SUSPENDED;

      const { data, error } = await this.supabase
        .from('users')
        .update({
          is_active: isActive,
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select('*')
        .single();

      if (error) {
        const err = extractError(error);
        this.logger.error('Error updating user status:', err.message);
        throw new BadRequestException(
          `Failed to update user status: ${err.message}`,
        );
      }

      // Log the status change
      await this.logStatusChange(userId, status, userId, reason);

      return {
        success: true,
        message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
        data: this.sanitizeUserResponse(data),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error in updateUserStatus:', err.message);
      throw error;
    }
  }

  async deactivate(id: string, reason?: string) {
    return this.updateUserStatus(id, false, reason);
  }

  async activate(id: string, reason?: string) {
    return this.updateUserStatus(id, true, reason);
  }

  async suspend(id: string, reason?: string) {
    return this.updateUserStatus(id, false, reason);
  }

  async remove(id: string, reason?: string) {
    const result = await this.updateUserStatus(
      id,
      false,
      reason || 'Account deleted',
    );
    return {
      success: true,
      message: 'User account deactivated successfully',
      data: null,
      timestamp: new Date().toISOString(),
    };
  }

  async getUserStats(userId: string) {
    this.logger.log(`Getting stats for user: ${userId}`);

    try {
      const user = await this.findOne(userId);

      // Get transaction statistics
      const [sentStats, receivedStats, totalTransactions] = await Promise.all([
        this.getTransactionStats(userId, 'sent'),
        this.getTransactionStats(userId, 'received'),
        this.getTotalTransactionCount(userId),
      ]);

      // Calculate wallet balances
      const totalBalance =
        user.wallets?.reduce((sum, wallet) => sum + wallet.balance, 0) || 0;
      const primaryWallet = user.wallets?.find((w) => w.type === 'PRIMARY');

      return {
        success: true,
        data: {
          user,
          stats: {
            transactions: {
              totalSent: sentStats.totalAmount,
              totalReceived: receivedStats.totalAmount,
              countSent: sentStats.count,
              countReceived: receivedStats.count,
              totalTransactions,
            },
            wallets: {
              totalBalance,
              primaryBalance: primaryWallet?.balance || 0,
              walletCount: user.wallets?.length || 0,
            },
            account: {
              kycStatus: user.kycStatus,
              kycTier: user.kycTier,
              status: user.status,
              memberSince: user.createdAt,
              lastLogin: user.lastLoginAt,
            },
          },
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error(`Error getting stats for user ${userId}:`, err.message);
      throw error;
    }
  }

  // Additional Helper Methods

  private async getTransactionStats(
    userId: string,
    direction: 'sent' | 'received',
  ) {
    try {
      const column =
        direction === 'sent' ? 'sender_wallet_id' : 'receiver_wallet_id';

      const { data, error } = await this.supabase
        .from('transactions')
        .select('amount')
        .eq(column, userId)
        .eq('status', 'COMPLETED');

      if (error) {
        const err = extractError(error);
        this.logger.warn(`Error getting ${direction} stats:`, err.message);
        return { totalAmount: 0, count: 0 };
      }

      const totalAmount = (data || []).reduce(
        (sum, txn) => sum + parseFloat(txn.amount || '0'),
        0,
      );
      return { totalAmount, count: data?.length || 0 };
    } catch (error) {
      const err = extractError(error);
      this.logger.warn(`Error calculating ${direction} stats:`, err.message);
      return { totalAmount: 0, count: 0 };
    }
  }

  private async getTotalTransactionCount(userId: string): Promise<number> {
    try {
      const { count, error } = await this.supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .or(`sender_wallet_id.eq.${userId},receiver_wallet_id.eq.${userId}`);

      if (error) {
        const err = extractError(error);
        this.logger.warn('Error getting transaction count:', err.message);
        return 0;
      }

      return count || 0;
    } catch (error) {
      const err = extractError(error);
      this.logger.warn('Error calculating transaction count:', err.message);
      return 0;
    }
  }

  async submitKyc(userId: string, kycData: KycSubmissionDto) {
    this.logger.log(`Submitting KYC for user: ${userId}`);

    try {
      // Create KYC document records
      const documents = kycData.documents.map((doc) => ({
        user_id: userId,
        document_type: doc.type,
        document_url: doc.url,
        uploaded_at: new Date().toISOString(),
      }));

      const { error: docsError } = await this.supabase
        .from('kyc_documents')
        .insert(documents);

      if (docsError) {
        const err = extractError(docsError);
        this.logger.error('Error inserting KYC documents:', err.message);
        throw new BadRequestException(
          `Failed to save KYC documents: ${err.message}`,
        );
      }

      // Update user profile with KYC submission
      const { data, error } = await this.supabase
        .from('user_profiles')
        .update({
          kyc_status: KycStatus.PENDING,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select('*')
        .single();
      if (error) {
        const err = extractError(error);
        this.logger.error('Error updating KYC status:', err.message);
        throw new BadRequestException(
          `Failed to update KYC status: ${err.message}`,
        );
      }

      // Log the submission
      await this.logStatusChange(
        userId,
        UserStatus.PENDING,
        userId,
        'KYC documents submitted',
      );

      return {
        success: true,
        message: 'KYC documents submitted successfully',
        data: {
          status: KycStatus.PENDING,
          submittedAt: new Date().toISOString(),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error in submitKyc:', err.message);
      throw error;
    }
  }

  async getAnalytics() {
    this.logger.log('Getting user analytics');

    try {
      // Get user counts by role
      const { data: roleStats, error: roleError } = await this.supabase
        .from('user_roles')
        .select('role')
        .eq('users.is_active', true);

      if (roleError) {
        const err = extractError(roleError);
        this.logger.error('Error fetching role statistics:', err.message);
        throw new BadRequestException(
          `Failed to fetch role statistics: ${err.message}`,
        );
      }

      // Get KYC status distribution
      const { data: kycStats, error: kycError } = await this.supabase
        .from('user_profiles')
        .select('kyc_status')
        .eq('users.is_active', true);

      if (kycError) {
        const err = extractError(kycError);
        this.logger.error('Error fetching KYC statistics:', err.message);
        throw new BadRequestException(
          `Failed to fetch KYC statistics: ${err.message}`,
        );
      }

      // Get user registration trends (last 30 days)
      const thirtyDaysAgo = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString();
      const { data: registrationData, error: regError } = await this.supabase
        .from('users')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: true });

      if (regError) {
        const err = extractError(regError);
        this.logger.error('Error fetching registration trends:', err.message);
        throw new BadRequestException(
          `Failed to fetch registration trends: ${err.message}`,
        );
      }

      // Process the data
      const roleCounts =
        roleStats?.reduce((acc, item) => {
          acc[item.role] = (acc[item.role] || 0) + 1;
          return acc;
        }, {}) || {};

      const kycCounts =
        kycStats?.reduce((acc, item) => {
          acc[item.kyc_status] = (acc[item.kyc_status] || 0) + 1;
          return acc;
        }, {}) || {};

      // Group registrations by day
      const registrationTrends =
        registrationData?.reduce((acc, item) => {
          const date = new Date(item.created_at).toDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {}) || {};

      return {
        success: true,
        data: {
          usersByRole: roleCounts,
          usersByKycStatus: kycCounts,
          registrationTrends,
          totalActiveUsers: roleStats?.length || 0,
          totalKycUsers:
            kycStats?.filter((k) => k.kyc_status !== KycStatus.PENDING)
              .length || 0,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      const err = extractError(error);
      this.logger.error('Error in getAnalytics:', err.message);
      throw error;
    }
  }

  private async logStatusChange(
    userId: string,
    status: UserStatus,
    adminId: string,
    reason?: string,
  ) {
    try {
      await this.supabase.from('audit_logs').insert({
        user_id: adminId,
        action: 'STATUS_CHANGE',
        resource_type: 'user',
        resource_id: userId,
        metadata: {
          new_status: status,
          reason,
        },
      });
    } catch (error) {
      const err = extractError(error);
      this.logger.warn('Failed to log status change:', err.message);
    }
  }
}
